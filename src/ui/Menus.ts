import * as vscode from 'vscode';

/**
 * MenuService provides interactive QuickPick menus for grouping related commands
 */
export class MenuService {
  /**
   * Show Crystallize menu with options for Tech Spec and Diplomat
   */
  async showCrystallizeMenu(): Promise<void> {
    const items: vscode.QuickPickItem[] = [
      {
        label: '$(file-text) Generate Tech Spec',
        description: 'Create a structured technical specification',
        detail: 'Transforms vague text into a clear technical spec with Clarity Score, blockers, risks, and acceptance criteria.',
      },
      {
        label: '$(mail) Draft Diplomat Response',
        description: 'Create a professional stakeholder reply',
        detail: 'Generates a senior professional response template for clarifying requirements with stakeholders.',
      },
    ];

    const selection = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select Crystallize option...',
      ignoreFocusOut: true,
    });

    if (!selection) {
      return;
    }

    // Execute the corresponding command
    if (selection.label.includes('Tech Spec')) {
      await vscode.commands.executeCommand('superprompt.crystallizeSpec');
    } else if (selection.label.includes('Diplomat')) {
      await vscode.commands.executeCommand('superprompt.crystallizeDiplomat');
    }
  }

  /**
   * Show Developer Tools menu with code and analysis tools
   */
  async showDeveloperToolsMenu(): Promise<void> {
    const items: vscode.QuickPickItem[] = [
      {
        label: '$(symbol-structure) Architect Prompt',
        description: 'Sanitize & wrap code for AI',
        detail: 'Scans code for sensitive data, masks it, and wraps in a structured prompt template ready for LLMs.',
      },
      {
        label: '$(checklist) Verify Implementation',
        description: 'Generate Definition of Done checklist',
        detail: 'Creates a structured checklist from a specification for manual verification.',
      },
      {
        label: '$(shield) Analyze Safety',
        description: 'Dry-run security scan',
        detail: 'Analyzes selected code for sensitive data without modifying anything. Results logged to Output Channel.',
      },
      {
        label: '$(diff) Compare Selections',
        description: 'View diff between two selections',
        detail: 'Compares two text selections and generates a structured markdown report.',
      },
    ];

    const selection = await vscode.window.showQuickPick(items, {
      placeHolder: 'Select Developer Tool...',
      ignoreFocusOut: true,
    });

    if (!selection) {
      return;
    }

    // Execute the corresponding command
    if (selection.label.includes('Architect')) {
      await vscode.commands.executeCommand('superprompt.architect');
    } else if (selection.label.includes('Verify')) {
      await vscode.commands.executeCommand('superprompt.verify');
    } else if (selection.label.includes('Analyze Safety')) {
      await vscode.commands.executeCommand('superprompt.analyzeSafety');
    } else if (selection.label.includes('Compare')) {
      await vscode.commands.executeCommand('superprompt.compareSelections');
    }
  }
}

