import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

/**
 * Example Component: Game HUD
 * Replicates the official "Game HUD Example" from Brand Guidelines v1.0 (Assets/Brand/brand-guidelines.png).
 * Demonstrates 100% semantic design token usage:
 * - Brand gradient primary on interactive buttons
 * - M3 Surface containers & elevation
 * - Level & currency badges referencing tertiary / accent tokens
 * - Deadline badges referencing error / red tokens
 * - Zero hard-coded hex colors
 */
export function GameHUDExample({ className = '' }) {
  return (
    <div className={`w-full max-w-2xl bg-secondary/90 text-secondary-foreground backdrop-blur-md rounded-m3-xl p-4 shadow-elevation-4 border border-outline/30 ${className}`}>
      {/* Top Header Row: Player Profile, Level, Wallet */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Player Profile & Department */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-m3-full bg-primary/20 border-2 border-primary flex items-center justify-center font-display font-bold text-base text-primary overflow-hidden">
              <span>AJ</span>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-m3-full bg-success border-2 border-secondary" title="Online" />
          </div>

          <div>
            <div className="font-display font-bold text-sm tracking-tight text-white">
              Alex Johnson
            </div>
            <div className="font-body text-xs text-surface-muted">
              Copywriter • BU1
            </div>
          </div>
        </div>

        {/* Level and Wallet Pills */}
        <div className="flex items-center gap-2">
          {/* Level Pill (Accent Yellow) */}
          <Badge variant="accent" size="md" icon={<span>★</span>}>
            Lv. 3
          </Badge>

          {/* Wallet Balance */}
          <div className="flex items-center bg-surface/10 hover:bg-surface/15 border border-outline/30 rounded-m3-full pl-3 pr-1 py-1 transition-colors">
            <span className="font-display font-semibold text-xs text-tertiary mr-1.5">₦</span>
            <span className="font-body font-semibold text-xs text-white mr-2">125,000</span>
            <button
              className="w-5 h-5 rounded-m3-full bg-primary text-white flex items-center justify-center text-xs font-bold hover:scale-105 active:scale-95 transition-transform"
              title="Add Funds"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Middle Row: Active Brief Card */}
      <div className="mt-3.5 bg-surface-container-low/10 border border-outline/20 rounded-m3-lg p-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-0.5">
            Current Brief
          </div>
          <div className="font-body text-xs font-medium text-white truncate">
            Create a campaign for Gen Z
          </div>
        </div>

        {/* Urgent Deadline Badge (Red) */}
        <Badge variant="deadline" size="sm">
          Due: 2d
        </Badge>
      </div>

      {/* Bottom Row: Navigation Dock */}
      <div className="mt-3.5 pt-3 border-t border-outline/20 flex items-center justify-around">
        {[
          { label: 'Home', icon: '⌂', active: true },
          { label: 'Career', icon: '💼', active: false },
          { label: 'Briefs', icon: '📋', active: false },
          { label: 'Awards', icon: '🏆', active: false },
          { label: 'Settings', icon: '⚙', active: false }
        ].map((item) => (
          <button
            key={item.label}
            className={`
              flex flex-col items-center gap-1 py-1 px-3 rounded-m3-md transition-all
              ${item.active
                ? 'text-primary font-semibold'
                : 'text-surface-muted hover:text-white'
              }
            `}
          >
            <span className="text-base">{item.icon}</span>
            <span className="text-[10px] font-body tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

