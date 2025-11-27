import * as vscode from 'vscode';

/**
 * Helper for opening results in split view
 */
export class ViewManager {
  /**
   * Open markdown content in a new editor tab beside the active editor
   */
  public static async openMarkdown(content: string, language: string = 'markdown'): Promise<void> {
    const doc = await vscode.workspace.openTextDocument({
      content,
      language,
    });

    await vscode.window.showTextDocument(doc, {
      viewColumn: vscode.ViewColumn.Beside,
      preview: false,
    });
  }
}

