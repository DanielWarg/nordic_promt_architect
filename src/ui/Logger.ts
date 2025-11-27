import * as vscode from 'vscode';

/**
 * Logger wrapper around VS Code OutputChannel
 */
export class Logger {
  private outputChannel: vscode.OutputChannel;

  constructor() {
    this.outputChannel = vscode.window.createOutputChannel('Nordic Prompt Logs');
  }

  private getTimestamp(): string {
    const now = new Date();
    return `[${now.toLocaleTimeString('sv-SE', { hour12: false })}]`;
  }

  private write(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
    this.outputChannel.appendLine(`${this.getTimestamp()} [${level}] ${message}`);
  }

  public info(message: string): void {
    this.write('INFO', message);
  }

  public warn(message: string): void {
    this.write('WARN', message);
  }

  public error(message: string, error?: unknown): void {
    this.write('ERROR', message);
    if (!error) {
      return;
    }

    if (error instanceof Error) {
      if (error.stack) {
        this.outputChannel.appendLine(`${this.getTimestamp()} [STACK] ${error.stack}`);
      } else {
        this.outputChannel.appendLine(`${this.getTimestamp()} [ERROR] ${error.message}`);
      }
    } else {
      this.outputChannel.appendLine(`${this.getTimestamp()} [DETAILS] ${JSON.stringify(error)}`);
    }
  }

  public show(preserveFocus = true): void {
    this.outputChannel.show(preserveFocus);
  }

  public dispose(): void {
    this.outputChannel.dispose();
  }
}

