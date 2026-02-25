// FormBuilder.tsx - Typeform-style form builder interface  
import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { surveyAPI, Survey, SurveyQuestion } from '../services/api'
import SaveSurveyModal from '../components/SaveSurveyModal'
import { canAuthorSurveys, getUserRole } from '../utils/auth'
import '../styles/FormBuilder.css'

interface LogicCondition {
  id: string
  questionId: string
  operator: 'is' | 'is_not' | 'contains' | 'greater_than' | 'less_than'
  value: string
}

interface LogicAction {
  id: string
  type: 'jump' | 'show' | 'hide' | 'calculate' | 'redirect'
  targetId?: string
  value?: string
}

interface LogicRule {
  id: string
  name: string
  enabled: boolean
  conditions: LogicCondition[]
  actions: LogicAction[]
  operator: 'and' | 'or'
}

interface Question {
  id: string
  type: string
  title: string
  description?: string
  required: boolean
  options?: string[]
  logicRules?: LogicRule[]
}

interface EdgeRef {
  sourceQuestionId: string
  ruleId: string
  actionId: string
}

const GRID_SIZE = 20

export default function FormBuilder() {
  const navigate = useNavigate()
  const location = useLocation()
  const { surveyId: surveyIdParam } = useParams<{ surveyId: string }>()
  const { templateType } = location.state || { templateType: 'CUSTOM' }

  const [formTitle, setFormTitle] = useState('Untitled form')
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      type: templateType === 'CONTACT_INFO' ? 'contact' : 'text',
      title: 'What is your name?',
      required: true,
      logicRules: [
        {
          id: 'rule-1',
          name: 'Jump to Q2',
          enabled: true,
          conditions: [],
          actions: [{ id: 'action-1', type: 'jump', targetId: '2' }],
          operator: 'and'
        }
      ]
    },
    {
      id: '2',
      type: 'choice',
      title: 'How did you hear about us?',
      required: false,
      logicRules: [
        {
          id: 'rule-2',
          name: 'Jump to Q3',
          enabled: true,
          conditions: [],
          actions: [{ id: 'action-2', type: 'jump', targetId: '3' }],
          operator: 'and'
        }
      ]
    },
    {
      id: '3',
      type: 'yesno',
      title: 'Would you like to subscribe?',
      required: false
    }
  ])
  const [activeQuestionId, setActiveQuestionId] = useState('1')
  const [activeTab, setActiveTab] = useState<'content' | 'preview' | 'workflow'>('content')
  const [selectedWorkflowQuestionId, setSelectedWorkflowQuestionId] = useState<string | null>(null)
  const [boxPositions, setBoxPositions] = useState<Record<string, { x: number; y: number }>>({})
  const [draggedBoxId, setDraggedBoxId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [canvasTool, setCanvasTool] = useState<'select' | 'hand'>('select')
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [selectedEdge, setSelectedEdge] = useState<EdgeRef | null>(null)
  const [connectingFromId, setConnectingFromId] = useState<string | null>(null)
  const [connectPointer, setConnectPointer] = useState<{ x: number; y: number } | null>(null)
  const [suppressSelectionClick, setSuppressSelectionClick] = useState(false)
  const [interactionLockUntil, setInteractionLockUntil] = useState(0)
  const [suppressGlobalClickUntil, setSuppressGlobalClickUntil] = useState(0)
  const suppressSelectionRef = useRef(false)
  const interactionLockRef = useRef(0)
  const [lockedQuestionId, setLockedQuestionId] = useState<string | null>(null)
  const [mouseDownQuestionId, setMouseDownQuestionId] = useState<string | null>(null)
  const [hasMoved, setHasMoved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [surveyId, setSurveyId] = useState<number | null>(null)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Keep refs in sync for event handlers (prevents stale-state click bug after drag release)
  useEffect(() => {
    suppressSelectionRef.current = suppressSelectionClick
    interactionLockRef.current = interactionLockUntil
  }, [suppressSelectionClick, interactionLockUntil])

  // Load survey if editing existing survey
  useEffect(() => {
    const loadSurvey = async () => {
      if (surveyIdParam) {
        try {
          setLoading(true)
          console.log(`📋 Loading survey ${surveyIdParam} for editing...`)
          const survey = await surveyAPI.getSurveyById(parseInt(surveyIdParam))
          console.log('✅ Survey loaded:', survey)
          
          // Set survey title
          setFormTitle(survey.title)
          setSurveyId(survey.surveyId!)
          
          // Convert API questions to FormBuilder format
          if (survey.questions && survey.questions.length > 0) {
            const convertedQuestions: Question[] = survey.questions.map((q, index) => ({
              id: q.questionId?.toString() || `q-${index}`,
              type: mapQuestionType(q.questionType),
              title: q.questionText,
              required: q.isRequired,
              options: q.options?.map(opt => opt.optionText) || undefined,
              logicRules: []
            }))
            setQuestions(convertedQuestions)
            setActiveQuestionId(convertedQuestions[0]?.id || '1')
          }
        } catch (error) {
          console.error('❌ Error loading survey:', error)
          alert('Failed to load survey. Redirecting to survey list...')
          navigate('/surveys')
        } finally {
          setLoading(false)
        }
      }
    }
    
    loadSurvey()
  }, [surveyIdParam, navigate])

  // Map API question types to FormBuilder question types
  const mapQuestionType = (apiType: string): string => {
    const typeMap: Record<string, string> = {
      'TEXT': 'text',
      'MULTIPLE_CHOICE': 'choice',
      'RATING_SCALE': 'rating',
      'MATRIX': 'choice', // Default to choice for matrix
    }
    return typeMap[apiType] || 'text'
  }

  // Handle mouse move for smooth dragging
  useEffect(() => {
    if (!mouseDownQuestionId) return

    const handleMouseMove = (e: MouseEvent) => {
      // Only start dragging if mouse has moved more than 5px threshold
      const distance = Math.sqrt(dragOffset.x ** 2 + dragOffset.y ** 2)
      if (distance > 5 && !hasMoved) {
        setHasMoved(true)
        setDraggedBoxId(mouseDownQuestionId)
      }

      if (draggedBoxId) {
        const canvas = document.querySelector('.branching-canvas-wrapper') as HTMLElement
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        // Account for zoom transform - divide by zoom to get actual canvas coordinates
        const newX = (e.clientX - rect.left - dragOffset.x - canvasOffset.x) / zoom
        const newY = (e.clientY - rect.top - dragOffset.y - canvasOffset.y) / zoom

        const snappedX = Math.round(newX / GRID_SIZE) * GRID_SIZE
        const snappedY = Math.round(newY / GRID_SIZE) * GRID_SIZE

        setBoxPositions(prev => ({
          ...prev,
          [draggedBoxId]: { x: Math.max(0, snappedX), y: Math.max(0, snappedY) }
        }))
      }
    }

    const handleMouseUp = () => {
      if (connectingFromId || suppressSelectionRef.current || Date.now() <= interactionLockRef.current) {
        setDraggedBoxId(null)
        setMouseDownQuestionId(null)
        setHasMoved(false)
        return
      }

      // If no movement, treat as click
      if (!hasMoved && mouseDownQuestionId) {
        setSelectedWorkflowQuestionId(mouseDownQuestionId)
        // Lock on question if fully zoomed out
        if (zoom === 0.5) {
          setLockedQuestionId(mouseDownQuestionId)
          setZoom(1.2)
        }
      }
      setDraggedBoxId(null)
      setMouseDownQuestionId(null)
      setHasMoved(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [draggedBoxId, dragOffset, zoom, mouseDownQuestionId, hasMoved, lockedQuestionId, canvasOffset, suppressSelectionClick, interactionLockUntil, connectingFromId])

  const activeQuestion = questions.find(q => q.id === activeQuestionId)
  const selectedWorkflowQuestion = questions.find(q => q.id === selectedWorkflowQuestionId)

  // Initialize box positions from grid layout
  const getBoxPosition = (index: number) => {
    if (boxPositions[questions[index]?.id]) {
      return boxPositions[questions[index].id]
    }
    return {
      x: 60 + (index % 5) * 120,
      y: 100 + Math.floor(index / 5) * 140
    }
  }

  const questionTypes = {
    contact: { label: 'Contact Info', icon: '👤' },
    email: { label: 'Email', icon: '📧' },
    phone: { label: 'Phone Number', icon: '📱' },
    text: { label: 'Short Text', icon: '📝' },
    longtext: { label: 'Long Text', icon: '📄' },
    choice: { label: 'Multiple Choice', icon: '🔘' },
    rating: { label: 'Rating', icon: '⭐' },
    nps: { label: 'Net Promoter Score', icon: '📊' },
    yesno: { label: 'Yes/No', icon: '✓' },
    dropdown: { label: 'Dropdown', icon: '▼' },
  }

  const addQuestion = (type: string) => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      type,
      title: '',
      required: true,
    }
    setQuestions([...questions, newQuestion])
    setActiveQuestionId(newQuestion.id)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q))
  }

  const deleteQuestion = (id: string) => {
    if (questions.length === 1) return
    const newQuestions = questions.filter(q => q.id !== id)
    setQuestions(newQuestions)
    setActiveQuestionId(newQuestions[0].id)
  }

  const duplicateQuestion = (id: string) => {
    const question = questions.find(q => q.id === id)
    if (!question) return
    const newQuestion = { ...question, id: Date.now().toString() }
    const index = questions.findIndex(q => q.id === id)
    const newQuestions = [...questions]
    newQuestions.splice(index + 1, 0, newQuestion)
    setQuestions(newQuestions)
  }

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return
    }
    const newQuestions = [...questions]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    const temp = newQuestions[index]
    newQuestions[index] = newQuestions[targetIndex]
    newQuestions[targetIndex] = temp
    setQuestions(newQuestions)
  }

  const handleSaveClick = () => {
    // If editing existing survey, save directly without modal
    if (surveyId) {
      handleSaveConfirm(formTitle)
    } else {
      // If new survey, show modal to get title
      setSaveModalOpen(true)
    }
  }

  const handleSaveConfirm = async (title: string) => {
    setSaving(true)
    setFormTitle(title)
    
    try {
      console.log(`📝 Saving survey: "${title}"`)
      
      // Transform questions to API format
      const apiQuestions: SurveyQuestion[] = questions.map((q, index) => ({
        questionText: q.title?.trim() || 'Untitled question',
        questionType: q.type,
        sortOrder: index + 1,
        isRequired: q.required,
        options: (q.options || []).map((optText, optIndex) => ({
          optionText: optText,
          optionValue: optText.toLowerCase().replace(/\s+/g, '_'),
          sortOrder: optIndex + 1
        }))
      }))

      console.log(`📋 Questions count: ${apiQuestions.length}`)

      const surveyData: Survey = {
        title: title,
        description: `Survey created with ${templateType} template`,
        templateType: templateType,
        status: 'DRAFT',
        createdBy: null, // TODO: Get from auth context
        isAnonymous: false,
        participantType: 'ALL',
        surveyStage: 'ONBOARDING',
        audienceSource: templateType === 'TEAM_MATE_VOICES' ? 'AUTO_API' : 'CSV_UPLOAD',
        sourceRef: '',
        autoSend: true,
        questions: apiQuestions
      }

      console.log(`🚀 Sending to API...`, surveyData)

      let savedSurvey: Survey
      if (surveyId) {
        // Update existing survey
        console.log(`🔄 Updating existing survey ID: ${surveyId}`)
        savedSurvey = await surveyAPI.updateSurvey(surveyId, surveyData)
        console.log(`✅ Survey updated successfully!`, savedSurvey)
        
        // Show success message and navigate back to survey list
        setSuccessMessage('Survey updated successfully!')
        setTimeout(() => {
          navigate('/surveys')
        }, 1000)
      } else {
        // Create new survey
        console.log(`✨ Creating new survey...`)
        savedSurvey = await surveyAPI.createSurvey(surveyData)
        setSurveyId(savedSurvey.surveyId!)
        console.log(`✅ Survey created successfully! ID: ${savedSurvey.surveyId}`, savedSurvey)
        
        // Show success message and navigate to survey list
        setSuccessMessage('Survey saved successfully!')
        setSaveModalOpen(false)
        setTimeout(() => {
          navigate('/surveys')
        }, 1000)
      }
      
      setSaveModalOpen(false)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error(`❌ Failed to save survey: ${errorMsg}`, error)
      
      // Provide helpful error messages
      let userMessage = `Error saving survey: ${errorMsg}`
      
      if (errorMsg.includes('Failed to fetch')) {
        userMessage = `Cannot connect to API server.\n\n⚠️ Make sure the Spring Boot API is running:\n\ncd packages/empsurvey-api && mvn spring-boot:run\n\nCheck browser console (F12) for more details.`
      } else if (errorMsg.includes('HTTP 500')) {
        userMessage = `Server error (HTTP 500).\n\n⚠️ Check that:\n1. Database is running\n2. API server logs for errors\n\nCheck browser console (F12) for details.`
      } else if (errorMsg.includes('HTTP 404')) {
        userMessage = `API endpoint not found (HTTP 404).\n\nPlease check the API URL in .env file.`
      }
      
      alert(userMessage)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    setSaving(true)
    
    try {
      // Transform questions to API format
      const apiQuestions: SurveyQuestion[] = questions.map((q, index) => ({
        questionText: q.title,
        questionType: q.type,
        sortOrder: index + 1,
        isRequired: q.required,
        options: (q.options || []).map((optText, optIndex) => ({
          optionText: optText,
          optionValue: optText.toLowerCase().replace(/\s+/g, '_'),
          sortOrder: optIndex + 1
        }))
      }))

      const surveyData: Survey = {
        title: formTitle,
        description: `Survey created with ${templateType} template`,
        templateType: templateType,
        status: 'DRAFT',
        createdBy: null, // TODO: Get from auth context
        isAnonymous: false,
        participantType: 'ALL',
        surveyStage: 'ONBOARDING',
        audienceSource: templateType === 'TEAM_MATE_VOICES' ? 'AUTO_API' : 'CSV_UPLOAD',
        sourceRef: '',
        autoSend: true,
        questions: apiQuestions
      }

      let savedSurvey: Survey
      if (surveyId) {
        // Update existing survey
        savedSurvey = await surveyAPI.updateSurvey(surveyId, surveyData)
      } else {
        // Create new survey
        savedSurvey = await surveyAPI.createSurvey(surveyData)
        setSurveyId(savedSurvey.surveyId!)
      }
      
      // Publish the survey
      await surveyAPI.publishSurvey(savedSurvey.surveyId!)
      alert('Survey published successfully!')
      navigate('/surveys')
    } catch (error) {
      console.error('Failed to publish survey:', error)
      alert('Error publishing survey: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setSaving(false)
    }
  }

  const addLogicRule = () => {
    if (!selectedWorkflowQuestionId) return
    const newRule: LogicRule = {
      id: Date.now().toString(),
      name: 'Untitled logic',
      enabled: true,
      conditions: [],
      actions: [],
      operator: 'and'
    }
    setQuestions(questions.map(q => 
      q.id === selectedWorkflowQuestionId 
        ? { ...q, logicRules: [...(q.logicRules || []), newRule] }
        : q
    ))
  }

  const deleteLogicRule = (id: string) => {
    if (!selectedWorkflowQuestionId) return
    setQuestions(questions.map(q => 
      q.id === selectedWorkflowQuestionId
        ? { ...q, logicRules: q.logicRules?.filter(rule => rule.id !== id) }
        : q
    ))
  }

  const handleBoxMouseDown = (e: React.MouseEvent, questionId: string) => {
    if (canvasTool === 'hand') return

    const canvas = document.querySelector('.branching-canvas-wrapper') as HTMLElement
    if (!canvas) return
    
    const pos = boxPositions[questionId] || getBoxPosition(questions.findIndex(q => q.id === questionId))
    const rect = canvas.getBoundingClientRect()
    // Calculate offset for drag threshold detection
    setDragOffset({
      x: e.clientX - rect.left - (pos.x * zoom + canvasOffset.x),
      y: e.clientY - rect.top - (pos.y * zoom + canvasOffset.y)
    })
    setMouseDownQuestionId(questionId)
    setHasMoved(false)
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 1.5))
  }

  const handleZoomOut = () => {
    // If locked, don't zoom out below 1.2; otherwise normal min is 0.5
    const minZoom = lockedQuestionId ? 1.2 : 0.5
    setZoom(prev => Math.max(prev - 0.2, minZoom))
  }

  const handleFitToView = () => {
    setZoom(1)
    setCanvasOffset({ x: 0, y: 0 })
    setLockedQuestionId(null)
  }

  useEffect(() => {
    // Initialize sample-like layout when entering workflow with unset custom positions
    if (activeTab === 'workflow' && Object.keys(boxPositions).length === 0 && questions.length > 0) {
      autoLayout()
    }
  }, [activeTab])

  const toggleCanvasTool = (tool: 'select' | 'hand') => {
    setCanvasTool(tool)
  }

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (canvasTool !== 'hand') return
    setIsPanning(true)
    setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y })
  }

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (connectingFromId) {
      const coords = toCanvasCoords(e)
      if (coords) setConnectPointer(coords)
      return
    }

    if (!isPanning || canvasTool !== 'hand') return
    setCanvasOffset({ x: e.clientX - panStart.x, y: e.clientY - panStart.y })
  }

  const handleCanvasMouseUp = () => {
    setIsPanning(false)
    if (connectingFromId) {
      setConnectingFromId(null)
      setConnectPointer(null)
      setSuppressSelectionClick(true)
      suppressSelectionRef.current = true
      setInteractionLockUntil(Date.now() + 700)
      interactionLockRef.current = Date.now() + 700
      setSuppressGlobalClickUntil(Date.now() + 700)
    }
  }

  const handleCanvasWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? 0.1 : -0.1
    setZoom(prev => Math.max(0.5, Math.min(1.8, Number((prev + delta).toFixed(2)))))
  }

  const toCanvasCoords = (e: React.MouseEvent) => {
    const canvas = document.querySelector('.branching-canvas-wrapper') as HTMLElement | null
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - canvasOffset.x) / zoom,
      y: (e.clientY - rect.top - canvasOffset.y) / zoom,
    }
  }

  const handleConnectStart = (e: React.MouseEvent, questionId: string) => {
    e.stopPropagation()
    const coords = toCanvasCoords(e)
    if (!coords) return
    setSuppressSelectionClick(true)
    suppressSelectionRef.current = true
    setInteractionLockUntil(Date.now() + 700)
    interactionLockRef.current = Date.now() + 700
    setSuppressGlobalClickUntil(Date.now() + 700)
    setSelectedWorkflowQuestionId(null)
    setMouseDownQuestionId(null)
    setDraggedBoxId(null)
    setConnectingFromId(questionId)
    setConnectPointer(coords)
  }

  const handleConnectEnd = (e: React.MouseEvent, targetQuestionId: string) => {
    e.stopPropagation()
    if (!connectingFromId || connectingFromId === targetQuestionId) {
      setConnectingFromId(null)
      setConnectPointer(null)
      setSuppressSelectionClick(true)
      suppressSelectionRef.current = true
      setInteractionLockUntil(Date.now() + 700)
      interactionLockRef.current = Date.now() + 700
      setSuppressGlobalClickUntil(Date.now() + 700)
      return
    }

    setQuestions(prev => prev.map(q => {
      if (q.id !== connectingFromId) return q

      const rules = q.logicRules || []
      const firstRule = rules[0]

      if (!firstRule) {
        return {
          ...q,
          logicRules: [{
            id: `rule-${Date.now()}`,
            name: 'Drag link rule',
            enabled: true,
            conditions: [],
            actions: [{ id: `action-${Date.now()}`, type: 'jump', targetId: targetQuestionId }],
            operator: 'and',
          }],
        }
      }

      return {
        ...q,
        logicRules: rules.map((r, i) => i === 0
          ? { ...r, actions: [...r.actions, { id: `action-${Date.now()}`, type: 'jump', targetId: targetQuestionId }] }
          : r),
      }
    }))

    setConnectingFromId(null)
    setConnectPointer(null)
    setInteractionLockUntil(Date.now() + 700)
    interactionLockRef.current = Date.now() + 700
    setSuppressGlobalClickUntil(Date.now() + 700)
  }

  const deleteSelectedEdge = () => {
    if (!selectedEdge) return

    setQuestions(prev => prev.map(q => {
      if (q.id !== selectedEdge.sourceQuestionId) return q
      return {
        ...q,
        logicRules: (q.logicRules || []).map(rule => {
          if (rule.id !== selectedEdge.ruleId) return rule
          return {
            ...rule,
            actions: rule.actions.filter(a => a.id !== selectedEdge.actionId)
          }
        })
      }
    }))

    setSelectedEdge(null)
  }

  const autoLayout = () => {
    const next: Record<string, { x: number; y: number }> = {}

    // Typeform-like default: single horizontal flow lane
    questions.forEach((q, i) => {
      next[q.id] = {
        x: 200 + i * 96,
        y: 430,
      }
    })

    setBoxPositions(next)
    setCanvasOffset({ x: 0, y: 0 })
    setZoom(1)
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedEdge) {
        e.preventDefault()
        deleteSelectedEdge()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedEdge])

  useEffect(() => {
    const swallowClickCapture = (e: MouseEvent) => {
      if (Date.now() <= suppressGlobalClickUntil) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    document.addEventListener('click', swallowClickCapture, true)
    return () => document.removeEventListener('click', swallowClickCapture, true)
  }, [suppressGlobalClickUntil])

  if (!canAuthorSurveys(getUserRole())) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Access denied</h2>
        <p>Only Admin can create/edit/publish surveys.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="form-builder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📋</div>
          <div>Loading survey...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="form-builder">
      {/* Success Message Banner */}
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10000,
          fontSize: '14px',
          fontWeight: '500',
          animation: 'slideDown 0.3s ease-out'
        }}>
          ✓ {successMessage}
        </div>
      )}
      
      {/* Top Toolbar */}
      <div className="builder-toolbar">
        <div className="toolbar-left">
          <button className="toolbar-btn-back" onClick={() => navigate('/surveys')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12 16L6 10L12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            className="form-title-input"
            placeholder="Untitled form"
          />
        </div>
        <div className="toolbar-center">
          <button
            className={`toolbar-tab ${activeTab === 'content' ? 'active' : ''}`}
            onClick={() => setActiveTab('content')}
          >
            Content
          </button>
          <button
            className={`toolbar-tab ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            className={`toolbar-tab ${activeTab === 'workflow' ? 'active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            Workflow
          </button>
        </div>
        <div className="toolbar-right">
          <button 
            className="toolbar-btn" 
            onClick={handleSaveClick}
            disabled={saving}
          >
            Save
          </button>
          <button 
            className="toolbar-btn-primary" 
            onClick={handlePublish}
            disabled={saving}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
      {/* Main Content Area */}
      <div className="builder-content">
        {activeTab === 'workflow' ? (
          <div className="workflow-branching-view">
            {/* Workflow Canvas Card */}
            <div className="workflow-canvas-card">
              {/* Workflow Tab - Branching Diagram */}
              <div className="branching-tabs">
                <button className="branching-tab active">Branching</button>
                <button className="branching-tab">Scoring</button>
                <button className="branching-tab">Tagging</button>
                <button className="branching-tab">Outcome quiz</button>
              </div>
              
              <div
                className="branching-canvas-wrapper"
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                onWheel={handleCanvasWheel}
                onClick={() => setSelectedEdge(null)}
                style={{
                  cursor: canvasTool === 'hand' ? (isPanning ? 'grabbing' : 'grab') : 'default',
                  background: '#f8f9fb'
                }}
              >
                <div className="canvas-content-scaler" style={{transform: `translate(${canvasOffset.x}px, ${canvasOffset.y}px) scale(${zoom})`}}>
              <svg className="branching-canvas" width="100%" height="100%">
                {/* Temporary drag-to-connect curve */}
                {connectingFromId && connectPointer && (() => {
                  const sourceIndex = questions.findIndex(q => q.id === connectingFromId)
                  if (sourceIndex === -1) return null
                  const sourcePos = getBoxPosition(sourceIndex)
                  const sourceX = sourcePos.x + 74
                  const sourceY = sourcePos.y + 16
                  const targetX = connectPointer.x
                  const targetY = connectPointer.y
                  const dx = targetX - sourceX
                  const dy = targetY - sourceY
                  const handleX = Math.max(22, Math.min(72, Math.abs(dx) * 0.26))
                  const c1y = Math.abs(dy) < 16 ? sourceY : sourceY + (dy > 0 ? 14 : -14)
                  const c2y = Math.abs(dy) < 16 ? targetY : targetY - (dy > 0 ? 14 : -14)
                  const curvePath = `M ${sourceX} ${sourceY} C ${sourceX + handleX} ${c1y}, ${targetX - handleX} ${c2y}, ${targetX} ${targetY}`

                  return (
                    <path
                      d={curvePath}
                      fill="none"
                      stroke="#6D5EF8"
                      strokeOpacity="0.85"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                  )
                })()}

                {/* Draw connection lines */}
                {questions.map((question, qIndex) => {
                  const sourcePos = getBoxPosition(qIndex)
                  
                  return question.logicRules?.map(rule => (
                    rule.actions.map((action) => {
                      if (action.type === 'jump' && action.targetId) {
                        const targetIndex = questions.findIndex(q => q.id === action.targetId)
                        if (targetIndex === -1) return null
                        
                        const targetPos = getBoxPosition(targetIndex)
                        
                        // Connect from right side of source box to left side of target box
                        const sourceX = sourcePos.x + 74 // Right side of chip
                        const sourceY = sourcePos.y + 16 // Vertical middle
                        const targetX = targetPos.x // Left side of chip
                        const targetY = targetPos.y + 16 // Vertical middle
                        
                        const edgeKey = `${question.id}-${rule.id}-${action.id}`
                        const isSelected =
                          selectedEdge?.sourceQuestionId === question.id &&
                          selectedEdge?.ruleId === rule.id &&
                          selectedEdge?.actionId === action.id

                        const dx = targetX - sourceX
                        const dy = targetY - sourceY
                        const handleX = Math.max(22, Math.min(72, Math.abs(dx) * 0.26))

                        // Gentle Typeform-like S-curves
                        let c1x = sourceX + handleX
                        let c2x = targetX - handleX
                        let c1y = sourceY
                        let c2y = targetY

                        if (Math.abs(dy) < 16) {
                          // same lane: keep line visually straight (no bow)
                          c1y = sourceY
                          c2y = targetY
                        } else {
                          // different lanes: preserve smooth vertical flow
                          const bend = Math.max(10, Math.min(28, Math.abs(dy) * 0.18))
                          c1y = sourceY + (dy > 0 ? bend : -bend)
                          c2y = targetY - (dy > 0 ? bend : -bend)
                        }

                        const curvePath = `M ${sourceX} ${sourceY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${targetX} ${targetY}`

                        return (
                          <g key={`line-${edgeKey}`}>
                            <path
                              d={curvePath}
                              fill="none"
                              stroke={isSelected ? '#6D5EF8' : '#B7BDCC'}
                              strokeOpacity={isSelected ? '0.95' : '0.65'}
                              strokeWidth={isSelected ? '3' : '1.75'}
                            />
                            <path
                              d={curvePath}
                              fill="none"
                              stroke="transparent"
                              strokeWidth="12"
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedEdge({ sourceQuestionId: question.id, ruleId: rule.id, actionId: action.id })
                              }}
                            />
                          </g>
                        )
                      }
                      return null
                    })
                  ))
                })}
              </svg>
              
              {/* Question boxes overlay */}
              <div className={`branching-boxes ${connectingFromId ? 'connecting-mode' : ''}`}>
                {questions.map((question, qIndex) => {
                  const pos = getBoxPosition(qIndex)
                  
                  return (
                    <div
                      key={question.id}
                      className={`question-box ${draggedBoxId === question.id ? 'dragging' : ''} ${lockedQuestionId === question.id ? 'locked' : ''} ${selectedWorkflowQuestionId === question.id ? 'selected' : ''}`}
                      style={{
                        left: `${pos.x}px`,
                        top: `${pos.y}px`,
                        position: 'absolute',
                        cursor: draggedBoxId === question.id ? 'grabbing' : 'grab',
                        userSelect: 'none',
                        transition: draggedBoxId === question.id ? 'none' : 'all 0.2s ease'
                      }}
                      onMouseDown={(e) => handleBoxMouseDown(e, question.id)}
                      onClick={() => {
                        if (suppressSelectionRef.current || Date.now() <= interactionLockRef.current) {
                          setSuppressSelectionClick(false)
                          suppressSelectionRef.current = false
                          return
                        }

                        if (!draggedBoxId) {
                          setSelectedWorkflowQuestionId(question.id)
                        }
                      }}
                    >
                      <button
                        className="question-connector question-connector-in"
                        title="Connect to this question"
                        onMouseUp={(e) => handleConnectEnd(e, question.id)}
                        onClick={(e) => e.stopPropagation()}
                      />

                      <div className="question-box-header">
                        <span className="box-number">{qIndex + 1}</span>
                      </div>
                      <div className="question-box-type">
                        {questionTypes[question.type as keyof typeof questionTypes]?.icon || '❓'}
                      </div>

                      <button
                        className="question-connector question-connector-out"
                        title="Drag to connect"
                        onMouseDown={(e) => handleConnectStart(e, question.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  )
                })}
              </div>
                </div>
            </div>
            {/* Canvas Controls Toolbar */}
            <div className="canvas-controls-toolbar">
              <button 
                className="canvas-control-btn" 
                title="Zoom In"
                onClick={handleZoomIn}
              >
                <span>➕</span>
              </button>
              <button 
                className="canvas-control-btn" 
                title="Zoom Out"
                onClick={handleZoomOut}
              >
                <span>➖</span>
              </button>
              <button 
                className="canvas-control-btn" 
                title="Fit to View"
                onClick={handleFitToView}
              >
                <span>⛶</span>
              </button>
              <button 
                className={`canvas-control-btn ${canvasTool === 'select' ? 'active' : ''}`}
                title="Selection Tool"
                onClick={() => toggleCanvasTool('select')}
              >
                <span>↪</span>
              </button>
              <button 
                className={`canvas-control-btn ${canvasTool === 'hand' ? 'active' : ''}`}
                title="Hand Tool"
                onClick={() => toggleCanvasTool('hand')}
              >
                <span>✋</span>
              </button>
              <button
                className="canvas-control-btn"
                title="Auto layout"
                onClick={autoLayout}
              >
                <span>🧭</span>
              </button>
              <button
                className="canvas-control-btn"
                title="Delete selected connection"
                onClick={deleteSelectedEdge}
                disabled={!selectedEdge}
              >
                <span>🗑</span>
              </button>
            </div>
            </div>
          </div>
        ) : (
          <>
            {/* Left Sidebar - Question List */}
            <div className="builder-sidebar-left">
          <div className="sidebar-header">
            <h3>Questions</h3>
            <span className="question-count">{questions.length}</span>
          </div>
          <div className="question-list">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`question-item ${activeQuestionId === question.id ? 'active' : ''}`}
                onClick={() => setActiveQuestionId(question.id)}
              >
                <div className="question-item-number">{index + 1}</div>
                <div className="question-item-content">
                  <div className="question-item-type">
                    {questionTypes[question.type as keyof typeof questionTypes]?.icon || '❓'}{' '}
                    {questionTypes[question.type as keyof typeof questionTypes]?.label || question.type}
                  </div>
                  <div className="question-item-title">
                    {question.title || 'Untitled question'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="add-question-btn" onClick={() => addQuestion('text')}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Add Question
          </button>
        </div>

        {/* Center - Question Editor */}
        <div className="builder-canvas">
          {activeTab === 'preview' ? (
            <div className="preview-container">
              <div className="preview-header">
                <h2>{formTitle}</h2>
              </div>
              {questions.map((question, index) => (
                <div key={question.id} className="preview-question">
                  <div className="preview-question-number">{index + 1}</div>
                  <h3>{question.title || 'Untitled question'}</h3>
                  {question.description && <p>{question.description}</p>}
                  {question.type === 'text' && <input type="text" placeholder="Type your answer here..." className="preview-input" />}
                  {question.type === 'longtext' && <textarea placeholder="Type your answer here..." className="preview-textarea" rows={4} />}
                  {question.type === 'choice' && question.options && (
                    <div className="preview-choices">
                      {question.options.map((option, i) => (
                        <label key={i} className="preview-choice">
                          <input type="radio" name={`question-${question.id}`} />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : activeQuestion ? (
            <div className="question-editor">
              <div className="question-editor-header">
                <div className="form-builder-question-number">Question {questions.findIndex(q => q.id === activeQuestionId) + 1}</div>
                <div className="question-actions">
                  <button
                    className="action-btn"
                    onClick={() => moveQuestion(activeQuestionId, 'up')}
                    disabled={questions.findIndex(q => q.id === activeQuestionId) === 0}
                    title="Move up"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 12V4M4 8L8 4L12 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => moveQuestion(activeQuestionId, 'down')}
                    disabled={questions.findIndex(q => q.id === activeQuestionId) === questions.length - 1}
                    title="Move down"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 4V12M12 8L8 12L4 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    className="action-btn"
                    onClick={() => duplicateQuestion(activeQuestionId)}
                    title="Duplicate"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M3 11V3C3 2.44772 3.44772 2 4 2H12" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </button>
                  <button
                    className="action-btn action-btn-delete"
                    onClick={() => deleteQuestion(activeQuestionId)}
                    disabled={questions.length === 1}
                    title="Delete"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 4H13M5 4V3C5 2.44772 5.44772 2 6 2H10C10.5523 2 11 2.44772 11 3V4M6 7V11M10 7V11M4 4L5 13C5 13.5523 5.44772 14 6 14H10C10.5523 14 11 13.5523 11 13L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>

              <div className="question-editor-content">
                <div className="form-field">
                  <label className="field-label">Question Type</label>
                  <select
                    value={activeQuestion.type}
                    onChange={(e) => updateQuestion(activeQuestionId, { type: e.target.value })}
                    className="field-select"
                  >
                    {Object.entries(questionTypes).map(([key, { label, icon }]) => (
                      <option key={key} value={key}>
                        {icon} {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">Question *</label>
                  <input
                    type="text"
                    value={activeQuestion.title}
                    onChange={(e) => updateQuestion(activeQuestionId, { title: e.target.value })}
                    placeholder="Type your question here..."
                    className="field-input field-input-large"
                  />
                </div>

                {(activeQuestion.type === 'choice' || activeQuestion.type === 'dropdown') && (
                  <div className="form-field">
                    <label className="field-label">Choices</label>
                    <div className="choices-editor">
                      {(activeQuestion.options || ['Option 1', 'Option 2']).map((option, index) => (
                        <div key={index} className="choice-item">
                          <span className="choice-letter">{String.fromCharCode(65 + index)}</span>
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...(activeQuestion.options || [])]
                              newOptions[index] = e.target.value
                              updateQuestion(activeQuestionId, { options: newOptions })
                            }}
                            className="choice-input"
                          />
                          <button
                            className="choice-delete"
                            onClick={() => {
                              const newOptions = (activeQuestion.options || []).filter((_, i) => i !== index)
                              updateQuestion(activeQuestionId, { options: newOptions })
                            }}
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        </div>
                      ))}
                      <button
                        className="add-choice-btn"
                        onClick={() => {
                          const newOptions = [...(activeQuestion.options || []), `Option ${(activeQuestion.options?.length || 0) + 1}`]
                          updateQuestion(activeQuestionId, { options: newOptions })
                        }}
                      >
                        + Add choice
                      </button>
                    </div>
                  </div>
                )}

                <div className="form-field">
                  <label className="field-checkbox">
                    <input
                      type="checkbox"
                      checked={activeQuestion.required}
                      onChange={(e) => updateQuestion(activeQuestionId, { required: e.target.checked })}
                    />
                    <span>Required question</span>
                  </label>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Right Sidebar - Question Settings */}
        <div className="builder-sidebar-right">
          <div className="sidebar-header">
            <h3>Settings</h3>
          </div>
          <div className="settings-content">
            {activeQuestion && (
              <div className="settings-section">
                <h4>Question Settings</h4>
                <div className="setting-item">
                  <label>Question Type</label>
                  <div className="setting-value">{questionTypes[activeQuestion.type as keyof typeof questionTypes]?.label || activeQuestion.type}</div>
                </div>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={activeQuestion.required}
                      onChange={(e) => updateQuestion(activeQuestionId, { required: e.target.checked })}
                    />
                    Required
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        </>
      )}
      </div>

    {/* CSS Animations for Modal */}
    <style>{`
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes modalFadeIn {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    `}</style>

    {/* Logic Modal Portal - Render outside form-builder to avoid overflow:hidden constraint */}
    {selectedWorkflowQuestionId && activeTab === 'workflow' && selectedWorkflowQuestion && typeof document !== 'undefined' && document.body && createPortal(
      <>
        {/* Overlay - Locks entire screen */}
        <div 
          className="modal-overlay-bg"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'auto',
            animation: 'fadeIn 0.2s ease-out'
          }}
          onClick={() => setSelectedWorkflowQuestionId(null)}
        />
        
        {/* Modal Container - Bigger but not full screen */}
        <div 
          className="modal-container"
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center center',
            width: '90%',
            height: '80%',
            maxWidth: '1200px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'modalFadeIn 0.2s ease-out forwards'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="modal-header-clean" style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            padding: '24px 24px 16px 24px',
            borderBottom: '1px solid #e5e5ea',
            flexShrink: 0
          }}>
            <div className="modal-title-section" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <h3 className="modal-title" style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1d1d1f',
                margin: 0
              }}>Edit logic for <span className="q-badge" style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '24px',
                height: '24px',
                padding: '0 6px',
                backgroundColor: '#ffe5e5',
                color: '#ff3b30',
                borderRadius: '4px',
                fontWeight: '600',
                fontSize: '12px',
                marginLeft: '6px'
              }}>Q{questions.findIndex(q => q.id === selectedWorkflowQuestionId) + 1}</span></h3>
              <button className="see-all-link" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                color: '#86868b',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                width: 'fit-content'
              }}>
                <span>📋</span> See all rules
              </button>
            </div>
            <button 
              className="modal-close-btn"
              onClick={() => setSelectedWorkflowQuestionId(null)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                color: '#86868b',
                cursor: 'pointer',
                padding: 0,
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="modal-body" style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {/* Always go to */}
            <div className="modal-section" style={{ marginBottom: '20px' }}>
              <label className="section-label" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: '#1d1d1f',
                marginBottom: '8px'
              }}>Always go to</label>
              <select className="modal-select" style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '13px',
                color: '#1d1d1f',
                backgroundColor: 'white',
                border: '1px solid #d2d2d7',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                <option value="">Select...</option>
                {questions.map((q, idx) => (
                  <option key={q.id} value={q.id}>Q{idx + 1} - {q.title || 'Untitled'}</option>
                ))}
                <option value="end">End of form</option>
              </select>
            </div>

            {/* Add Rule */}
            <div className="modal-section" style={{ marginBottom: '20px' }}>
              <button className="btn-add-rule" onClick={addLogicRule} style={{
                width: '100%',
                padding: '10px',
                fontSize: '13px',
                fontWeight: '500',
                color: '#0071e3',
                backgroundColor: '#f5f5f7',
                border: '1px solid #d2d2d7',
                borderRadius: '6px',
                cursor: 'pointer'
              }}>
                + Add rule
              </button>
            </div>

            {/* Rules List */}
            {selectedWorkflowQuestion.logicRules && selectedWorkflowQuestion.logicRules.length > 0 && (
              <div className="rules-container" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {selectedWorkflowQuestion.logicRules.map((rule, idx) => (
                  <div key={rule.id} className="rule-row" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    backgroundColor: '#f9f9fb',
                    border: '1px solid #e5e5ea',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    <span className="rule-num" style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '24px',
                      height: '24px',
                      backgroundColor: '#e5e5ea',
                      borderRadius: '4px',
                      fontWeight: '600',
                      color: '#1d1d1f',
                      flexShrink: 0
                    }}>{idx + 1}</span>
                    <span className="rule-text" style={{
                      flex: 1,
                      color: '#1d1d1f'
                    }}>
                      {rule.conditions.length} condition{rule.conditions.length !== 1 ? 's' : ''} →
                      {rule.actions.map(a => {
                        if (a.type === 'jump' && a.targetId) {
                          const targetIdx = questions.findIndex(q => q.id === a.targetId)
                          return ` Q${targetIdx + 1}`
                        }
                        return ''
                      }).join(', ')}
                    </span>
                    <button
                      className="rule-delete-btn"
                      onClick={() => deleteLogicRule(rule.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#d70015',
                        cursor: 'pointer',
                        fontSize: '14px',
                        padding: 0
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-footer-clean" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderTop: '1px solid #e5e5ea',
            flexShrink: 0
          }}>
            <button 
              className="btn-delete-all"
              onClick={() => {
                if (selectedWorkflowQuestion.logicRules) {
                  selectedWorkflowQuestion.logicRules.forEach(rule => deleteLogicRule(rule.id))
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#d70015',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0
              }}
            >
              🗑 Delete all rules
            </button>
            <div className="footer-actions" style={{
              display: 'flex',
              gap: '8px'
            }}>
              <button 
                className="btn-cancel"
                onClick={() => setSelectedWorkflowQuestionId(null)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: '#1d1d1f',
                  backgroundColor: '#f5f5f7',
                  border: '1px solid #d2d2d7',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                className="btn-save"
                onClick={() => setSelectedWorkflowQuestionId(null)}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'white',
                  backgroundColor: '#0071e3',
                  border: '1px solid #0071e3',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </>,
      document.body
    )}

    {/* Save Survey Modal */}
    <SaveSurveyModal
      isOpen={saveModalOpen}
      currentTitle={formTitle}
      isSaving={saving}
      onSave={handleSaveConfirm}
      onCancel={() => setSaveModalOpen(false)}
    />
  </div>
)
}