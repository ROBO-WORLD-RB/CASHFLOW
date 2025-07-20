/**
 * Development console commands for easy data management
 * These functions are available in the browser console during development
 */

import { 
  resetAllAppData, 
  resetFinancialDataOnly, 
  resetUserPreferencesOnly, 
  addSampleData,
  getDataSummary 
} from './resetAppData';

// Make functions available globally in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Add to window object for console access
  (window as any).cashflowDev = {
    // Data reset functions
    resetAll: () => {
      console.log('🔄 Resetting all app data...');
      resetAllAppData();
    },
    
    resetFinancial: () => {
      console.log('💰 Resetting financial data only...');
      resetFinancialDataOnly();
    },
    
    resetUser: () => {
      console.log('👤 Resetting user preferences only...');
      resetUserPreferencesOnly();
    },
    
    addSample: () => {
      console.log('📊 Adding sample data...');
      addSampleData();
    },
    
    summary: () => {
      console.log('📋 Current data summary:');
      console.table(getDataSummary());
    },
    
    // Quick localStorage inspection
    inspectStorage: () => {
      console.log('🔍 LocalStorage contents:');
      const storage: any = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            storage[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
            storage[key] = localStorage.getItem(key);
          }
        }
      }
      console.table(storage);
    },
    
    // Clear specific localStorage keys
    clearStorage: (pattern?: string) => {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (!pattern || key.includes(pattern))) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`🗑️ Cleared ${keysToRemove.length} localStorage keys:`, keysToRemove);
    },
    
    // Help command
    help: () => {
      console.log(`
🚀 CASHFLOW Development Console Commands:

Data Reset:
  cashflowDev.resetAll()      - Reset all app data (page reloads)
  cashflowDev.resetFinancial() - Reset only financial data
  cashflowDev.resetUser()     - Reset only user preferences
  
Test Data:
  cashflowDev.addSample()     - Add sample transactions and goals
  
Inspection:
  cashflowDev.summary()       - Show current data summary
  cashflowDev.inspectStorage() - Show all localStorage contents
  
Storage Management:
  cashflowDev.clearStorage()  - Clear all localStorage
  cashflowDev.clearStorage('budgetup') - Clear keys containing 'budgetup'
  
Help:
  cashflowDev.help()          - Show this help message

Example Usage:
  > cashflowDev.summary()     // Check current state
  > cashflowDev.resetAll()    // Fresh start
  > cashflowDev.addSample()   // Add test data
      `);
    }
  };
  
  // Show welcome message
  console.log(`
🎉 CASHFLOW Development Console Ready!

Type 'cashflowDev.help()' for available commands.

Quick Start:
• cashflowDev.resetAll() - Fresh start
• cashflowDev.addSample() - Add test data
• cashflowDev.summary() - Check current state
  `);
}

export {}; // Make this a module