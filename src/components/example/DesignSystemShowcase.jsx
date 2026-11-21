import React, { useState } from 'react';
import { brandColors, brandGradients } from '../../tokens/brand';
import { office3DTheme } from '../../tokens/3d-materials';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { GameHUDExample } from './GameHUDExample';

/**
 * Design System Showcase & Central Token Inspector
 * Provides a visual demonstration of the Material 3 & X3M Ideas Design Tokens.
 */
export function DesignSystemShowcase({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('components');
  const [isDarkMode, setIsDarkMode] = useState(false);

  if (!isOpen) return null;

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    const root = document.documentElement;
    if (nextDark) {
      root.classList.add('theme-dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('theme-dark');
      root.removeAttribute('data-theme');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-surface text-surface-foreground rounded-m3-xl shadow-elevation-5 border border-outline flex flex-col overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline bg-surface-container-low">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-m3-md bg-brand-gradient-primary flex items-center justify-center text-white font-display font-bold text-sm">
              X
            </div>
            <div>
              <h2 className="font-display font-bold text-base leading-tight">
                X3M Ideas • Design Token System (M3)
              </h2>
              <p className="font-body text-xs text-surface-variant-foreground">
                Central Source of Truth • Assets/Brand/brand-guidelines.png
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleTheme}
              className="text-xs"
            >
              {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </Button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-m3-full flex items-center justify-center text-surface-variant-foreground hover:text-surface-foreground hover:bg-surface-container transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex px-6 border-b border-outline bg-surface-container-lowest">
          {[
            { id: 'components', label: 'UI Components & Game HUD' },
            { id: 'colors', label: 'Brand & Semantic Colors' },
            { id: 'typography', label: 'Typography (Montserrat / Inter)' },
            { id: '3d-materials', label: 'Central 3D Materials' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-3 text-xs font-medium border-b-2 transition-all font-body
                ${activeTab === tab.id
                  ? 'border-primary text-primary font-semibold'
                  : 'border-transparent text-surface-variant-foreground hover:text-surface-foreground'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: UI Components & Game HUD */}
          {activeTab === 'components' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-surface-variant-foreground mb-3">
                  Official Game HUD Preview (Material 3)
                </h3>
                <div className="flex justify-center p-4 bg-surface-container rounded-m3-lg border border-outline">
                  <GameHUDExample />
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-surface-variant-foreground mb-3">
                  Buttons & Interactive States (Semantic Tokens)
                </h3>
                <div className="flex flex-wrap items-center gap-3 p-4 bg-surface-container-low rounded-m3-lg border border-outline">
                  <Button variant="primary-gradient" size="md">
                    Primary Button →
                  </Button>
                  <Button variant="secondary" size="md">
                    Secondary Button
                  </Button>
                  <Button variant="tonal" size="md">
                    Tonal Container
                  </Button>
                  <Button variant="text" size="md">
                    Text Action
                  </Button>
                  <Button variant="primary-gradient" size="md" disabled>
                    Disabled State
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-surface-variant-foreground mb-3">
                  Feedback & Status Alerts (Brand Guidelines v1.0 UI Elements)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Alert variant="success" title="Success">
                    Action Successful!
                  </Alert>
                  <Alert variant="warning" title="Warning">
                    Please try again.
                  </Alert>
                  <Alert variant="error" title="Deadline Alert">
                    Brief submission deadline has passed.
                  </Alert>
                  <Alert variant="info" title="Office Notification">
                    Executive meeting starts in 10 minutes at Boardroom A.
                  </Alert>
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-surface-variant-foreground mb-3">
                  Badges & Game Indicators
                </h3>
                <div className="flex flex-wrap gap-2 p-4 bg-surface-container-low rounded-m3-lg border border-outline">
                  <Badge variant="accent" icon={<span>★</span>}>Lv. 3</Badge>
                  <Badge variant="deadline">Due: 2d</Badge>
                  <Badge variant="primary">Executive</Badge>
                  <Badge variant="secondary">Copywriter</Badge>
                  <Badge variant="success">Completed</Badge>
                  <Badge variant="warning">In Review</Badge>
                  <Badge variant="error">High Priority</Badge>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Colors */}
          {activeTab === 'colors' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-surface-variant-foreground mb-3">
                  Official Brand Palette (from brand-guidelines.png)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(brandColors)
                    .filter(([_, c]) => c.status === 'official')
                    .map(([key, color]) => (
                      <div key={key} className="p-3 bg-surface-container rounded-m3-md border border-outline flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-m3-sm border border-outline shadow-elevation-1 flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0">
                          <div className="font-display font-semibold text-xs truncate capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </div>
                          <div className="font-mono text-xs text-primary font-bold">{color.hex}</div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-success/20 text-success">
                            {color.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-surface-variant-foreground mb-3">
                  Provisional Semantic Palette (Derived / Documented)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(brandColors)
                    .filter(([_, c]) => c.status !== 'official')
                    .map(([key, color]) => (
                      <div key={key} className="p-3 bg-surface-container rounded-m3-md border border-outline flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-m3-sm border border-outline shadow-elevation-1 flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <div className="min-w-0">
                          <div className="font-display font-semibold text-xs truncate capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </div>
                          <div className="font-mono text-xs text-surface-variant-foreground font-medium">{color.hex}</div>
                          <span className="inline-block mt-0.5 px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-amber-500/20 text-amber-500">
                            {color.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wider text-surface-variant-foreground mb-3">
                  Official Signature Gradients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-m3-md border border-outline text-white shadow-elevation-2" style={{ background: brandGradients.primary }}>
                    <div className="font-display font-bold text-sm">X3M Primary Signature Gradient</div>
                    <div className="font-mono text-xs opacity-90 mt-1">{brandColors.x3mOrange.hex} → {brandColors.x3mRed.hex}</div>
                  </div>
                  <div className="p-4 rounded-m3-md border border-outline text-charcoal shadow-elevation-2" style={{ background: brandGradients.accent }}>
                    <div className="font-display font-bold text-sm text-gray-900">X3M Accent Highlight Gradient</div>
                    <div className="font-mono text-xs text-gray-800 opacity-90 mt-1">{brandColors.x3mOrange.hex} → {brandColors.accentYellow.hex}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Typography */}
          {activeTab === 'typography' && (
            <div className="space-y-6">
              <div className="p-4 bg-surface-container rounded-m3-lg border border-outline">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary block mb-1">
                  Headings & Display Font
                </span>
                <h1 className="font-display font-bold text-2xl mb-1">
                  Montserrat (Bold, Semibold, Medium)
                </h1>
                <p className="font-display text-sm text-surface-variant-foreground">
                  The quick brown fox jumps over the lazy dog • 1234567890 • ₦125,000
                </p>
              </div>

              <div className="p-4 bg-surface-container rounded-m3-lg border border-outline">
                <span className="text-[10px] uppercase font-bold tracking-wider text-primary block mb-1">
                  Body, Labels & UI Font
                </span>
                <h2 className="font-body font-medium text-lg mb-1">
                  Inter (Medium, Regular, Light)
                </h2>
                <p className="font-body text-sm text-surface-variant-foreground leading-relaxed">
                  Agency life simulation combines career progression, client briefs, salary negotiation, and NPC interactions inside a stylised low-poly 3D office.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Central 3D Environment Materials */}
          {activeTab === '3d-materials' && (
            <div className="space-y-4">
              <p className="font-body text-xs text-surface-variant-foreground">
                All 3D architectural, furniture, and lighting materials reference these centralized design tokens.
                Updating a token updates both the 2D UI and 3D environment in lockstep.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(office3DTheme.brandAccents).map(([key, mat]) => (
                  <div key={key} className="p-3 bg-surface-container rounded-m3-md border border-outline flex items-center justify-between">
                    <div>
                      <div className="font-display font-semibold text-xs capitalize">{key}</div>
                      <div className="font-body text-[11px] text-surface-variant-foreground">{mat.description}</div>
                      <div className="font-mono text-[10px] text-primary mt-1">Roughness: {mat.roughness} • Metalness: {mat.metalness}</div>
                    </div>
                    <div
                      className="w-9 h-9 rounded-m3-sm border border-outline shadow-elevation-1 flex-shrink-0"
                      style={{ backgroundColor: mat.color }}
                    />
                  </div>
                ))}

                {Object.entries(office3DTheme.architecture).map(([key, mat]) => (
                  <div key={key} className="p-3 bg-surface-container rounded-m3-md border border-outline flex items-center justify-between">
                    <div>
                      <div className="font-display font-semibold text-xs capitalize">{key}</div>
                      <div className="font-body text-[11px] text-surface-variant-foreground">{mat.description}</div>
                      <div className="font-mono text-[10px] text-surface-variant-foreground mt-1">Color: {mat.color}</div>
                    </div>
                    <div
                      className="w-9 h-9 rounded-m3-sm border border-outline shadow-elevation-1 flex-shrink-0"
                      style={{ backgroundColor: mat.color }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-surface-container-low border-t border-outline flex items-center justify-between">
          <div className="text-xs text-surface-variant-foreground font-body">
            Centralized Token Status: <strong className="text-success">Active & Integrated</strong>
          </div>
          <Button variant="primary-gradient" size="sm" onClick={onClose}>
            Back to 3D Scene
          </Button>
        </div>
      </div>
    </div>
  );
}
