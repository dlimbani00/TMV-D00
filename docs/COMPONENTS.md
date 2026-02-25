# Component Usage Guide

## Button

A versatile button component with multiple variants and states.

### Import

```tsx
import { Button } from '@arya/design-system';
```

### Basic Usage

```tsx
<Button>Click me</Button>
```

### Variants

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="tertiary">Tertiary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="ghost">Ghost</Button>
```

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### States

```tsx
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
```

### With Icons

```tsx
<Button iconBefore={<IconChevronLeft />}>Back</Button>
<Button iconAfter={<IconChevronRight />}>Next</Button>
```

---

## Card

A flexible container component for grouping content.

### Import

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@arya/design-system';
```

### Basic Usage

```tsx
<Card>
  <CardHeader>
    <h3>Card Title</h3>
  </CardHeader>
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Variants

```tsx
<Card variant="elevated">Elevated with shadow</Card>
<Card variant="filled">Filled background</Card>
<Card variant="outlined">With border</Card>
<Card glass>Glass morphism effect</Card>
```

### Interactive Cards

```tsx
<Card hoverable>Hover effect</Card>
<Card pressable>Press effect</Card>
```

### Padding

```tsx
<Card padding="none">No padding</Card>
<Card padding="sm">Small padding</Card>
<Card padding="md">Medium padding</Card>
<Card padding="lg">Large padding</Card>
```

---

## Input

A text input component with label, helper text, and error states.

### Import

```tsx
import { Input } from '@arya/design-system';
```

### Basic Usage

```tsx
<Input placeholder="Enter text" />
```

### With Label

```tsx
<Input 
  label="Email"
  type="email"
  placeholder="Enter your email"
/>
```

### With Helper Text

```tsx
<Input 
  label="Username"
  helperText="Choose a unique username"
/>
```

### Error State

```tsx
<Input 
  label="Password"
  error
  helperText="Password is required"
/>
```

### Sizes

```tsx
<Input size="sm" placeholder="Small" />
<Input size="md" placeholder="Medium" />
<Input size="lg" placeholder="Large" />
```

### With Icons

```tsx
<Input 
  iconBefore={<IconSearch />}
  placeholder="Search..."
/>

<Input 
  iconAfter={<IconEye />}
  type="password"
  placeholder="Password"
/>
```

### Full Width

```tsx
<Input fullWidth placeholder="Full width input" />
```

---

## Design Tokens

### Colors

```tsx
import { colors } from '@arya/design-system';

// System colors
colors.system.blue // #007AFF
colors.system.red // #FF3B30
colors.system.green // #34C759

// Light mode
colors.light.background.primary // #FFFFFF
colors.light.text.primary // #000000

// Dark mode
colors.dark.background.primary // #000000
colors.dark.text.primary // #FFFFFF
```

### Typography

```tsx
import { typography } from '@arya/design-system';

// Font sizes
typography.fontSize.largeTitle // 34px
typography.fontSize.body // 17px

// Text styles
typography.textStyle.headline
// { fontSize: '17px', lineHeight: '22px', fontWeight: 600, ... }
```

### Spacing

```tsx
import { spacing } from '@arya/design-system';

spacing[2] // 16px (2 × 8px)
spacing.md // 16px
spacing.inset.lg // 20px
```

### Shadows

```tsx
import { shadows } from '@arya/design-system';

shadows.card.light // '0 2px 8px rgba(0, 0, 0, 0.08)'
shadows.depth[3] // '0 4px 8px rgba(0, 0, 0, 0.1)'
```

### Border Radius

```tsx
import { radius } from '@arya/design-system';

radius.ios.medium // 10px
radius.base // 8px
```

### Transitions

```tsx
import { transitions } from '@arya/design-system';

transitions.duration.fast // 150ms
transitions.easing.standard // cubic-bezier(0.4, 0.0, 0.2, 1)
transitions.all.base // 'all 250ms cubic-bezier(0.4, 0.0, 0.2, 1)'
```

---

## Theming

ARYA automatically adapts to system preferences for light and dark mode using CSS media queries.

### Custom Theme

Create a CSS file with custom properties:

```css
:root {
  --arya-primary-color: #007AFF;
  --arya-background: #FFFFFF;
  --arya-text: #000000;
}

@media (prefers-color-scheme: dark) {
  :root {
    --arya-primary-color: #0A84FF;
    --arya-background: #000000;
    --arya-text: #FFFFFF;
  }
}
```

### Accessing Tokens in JavaScript

```tsx
import { colors, typography, spacing } from '@arya/design-system';

const MyComponent = () => {
  return (
    <div style={{
      color: colors.system.blue,
      fontSize: typography.fontSize.body,
      padding: spacing.md,
    }}>
      Styled with design tokens
    </div>
  );
};
```

---

## Best Practices

### Composition

Build complex UIs by composing simple components:

```tsx
<Card variant="elevated">
  <CardHeader>
    <h3>Sign In</h3>
  </CardHeader>
  <CardBody>
    <Input 
      label="Email"
      type="email"
      fullWidth
      iconBefore={<IconMail />}
    />
    <Input 
      label="Password"
      type="password"
      fullWidth
      iconBefore={<IconLock />}
    />
  </CardBody>
  <CardFooter>
    <Button variant="primary" fullWidth>
      Sign In
    </Button>
  </CardFooter>
</Card>
```

### Responsive Design

Use CSS media queries or the breakpoints tokens:

```tsx
import { breakpoints } from '@arya/design-system';

const styles = {
  container: {
    padding: '16px',
    [`@media (min-width: ${breakpoints.md})`]: {
      padding: '24px',
    },
  },
};
```

### Accessibility

Always include proper labels and ARIA attributes:

```tsx
<Input 
  label="Search"
  aria-label="Search products"
  placeholder="Type to search..."
/>

<Button aria-label="Close dialog">
  <IconClose />
</Button>
```
