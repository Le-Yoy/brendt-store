// src/app/components/page.jsx
import React from 'react';
import Button from '../../components/common/Button';

export default function ComponentsPage() {
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1>Button Components</h1>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Button Variants</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="dark">Dark Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="text">Text Button</Button>
        </div>
      </section>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Button Sizes</h2>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="secondary" size="small">Small</Button>
          <Button variant="secondary" size="medium">Medium</Button>
          <Button variant="secondary" size="large">Large</Button>
        </div>
      </section>
      
      <section style={{ marginBottom: '40px' }}>
        <h2>Button States</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>Disabled</Button>
          <Button variant="primary" isLoading>Loading</Button>
        </div>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Button variant="secondary">Normal</Button>
          <Button variant="secondary" disabled>Disabled</Button>
          <Button variant="secondary" isLoading>Loading</Button>
        </div>
      </section>
      
      <section>
        <h2>Full Width Button</h2>
        <div style={{ maxWidth: '500px', marginBottom: '16px' }}>
          <Button variant="primary" fullWidth>Full Width Button</Button>
        </div>
        <div style={{ maxWidth: '500px' }}>
          <Button variant="secondary" fullWidth>Full Width Button</Button>
        </div>
      </section>
    </div>
  );
}