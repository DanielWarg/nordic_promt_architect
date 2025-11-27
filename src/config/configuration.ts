import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../ui/Logger';
import { DEFAULT_CONFIG, SuperPromptConfig } from './defaults';

/**
 * Configuration service that loads .superpromptrc.json, merges user settings
 * with enterprise defaults, and gracefully handles invalid configs.
 */
export class ConfigurationService implements vscode.Disposable {
  private readonly logger: Logger;
  private readonly configFileName = '.superpromptrc.json';
  private saveWatcher?: vscode.Disposable;
  private currentConfig: SuperPromptConfig = DEFAULT_CONFIG;
  private usingDefaults = true;

  constructor(logger: Logger) {
    this.logger = logger;
    this.loadConfig();
    this.setupSaveWatcher();
  }

  public getConfig(): SuperPromptConfig {
    return this.currentConfig;
  }

  public dispose(): void {
    this.saveWatcher?.dispose();
  }

  private setupSaveWatcher(): void {
    this.saveWatcher = vscode.workspace.onDidSaveTextDocument((document) => {
      if (!document.fileName.endsWith(this.configFileName)) {
        return;
      }

      this.logger.info(`${this.configFileName} saved. Reloading configuration...`);
      this.loadConfig();
    });
  }

  private loadConfig(): void {
    const workspaceRoot = this.getWorkspaceRoot();
    if (!workspaceRoot) {
      this.logger.warn('No workspace detected. Using secure defaults.');
      this.currentConfig = DEFAULT_CONFIG;
      this.usingDefaults = true;
      return;
    }

    const configPath = path.join(workspaceRoot, this.configFileName);
    if (!fs.existsSync(configPath)) {
      this.logger.warn(`${this.configFileName} not found. Using secure defaults.`);
      this.showMissingConfigWarning(workspaceRoot);
      this.currentConfig = DEFAULT_CONFIG;
      this.usingDefaults = true;
      return;
    }

    try {
      const rawContent = fs.readFileSync(configPath, 'utf8');
      const parsed = JSON.parse(rawContent) as Partial<SuperPromptConfig>;
      this.currentConfig = this.mergeConfig(DEFAULT_CONFIG, parsed);
      this.usingDefaults = false;
      this.logger.info(
        `Configuration loaded (mode=${this.currentConfig.security.mode}, language=${this.currentConfig.project.language})`
      );
    } catch (error) {
      this.logger.error(`Failed to parse ${this.configFileName}`, error);
      vscode.window.showWarningMessage(
        'Nordic Prompt Architect: config invalid — using secure defaults. See Nordic Prompt Logs for details.'
      );
      this.currentConfig = DEFAULT_CONFIG;
      this.usingDefaults = true;
    }
  }

  private mergeConfig(
    defaults: SuperPromptConfig,
    override: Partial<SuperPromptConfig> = {}
  ): SuperPromptConfig {
    return {
      project: {
        ...defaults.project,
        ...override.project,
      },
      security: {
        ...defaults.security,
        ...override.security,
      },
      templates: {
        ...defaults.templates,
        ...override.templates,
      },
    };
  }

  private getWorkspaceRoot(): string | undefined {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
      return undefined;
    }
    return workspaceFolders[0].uri.fsPath;
  }

  public isUsingDefaults(): boolean {
    return this.usingDefaults;
  }

  private static notifiedMissing = new Set<string>();

  private showMissingConfigWarning(workspacePath: string): void {
    if (ConfigurationService.notifiedMissing.has(workspacePath)) {
      return;
    }
    ConfigurationService.notifiedMissing.add(workspacePath);
    vscode.window.showWarningMessage(
      `Nordic Prompt Architect: ${this.configFileName} missing — using secure defaults. Run 'SuperPrompt: Initialize Config' to create one.`
    );
  }

  public async initializeConfig(): Promise<boolean> {
    const workspaceRoot = this.getWorkspaceRoot();
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('Open a workspace folder before initializing Nordic Prompt Architect.');
      return false;
    }

    const targetPath = path.join(workspaceRoot, this.configFileName);
    if (fs.existsSync(targetPath)) {
      const overwrite = await vscode.window.showWarningMessage(
        `${this.configFileName} already exists. Overwrite?`,
        'Overwrite',
        'Cancel'
      );
      if (overwrite !== 'Overwrite') {
        return false;
      }
    }

    try {
      fs.writeFileSync(targetPath, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf8');
      this.logger.info(`Created ${this.configFileName} with secure defaults.`);
      vscode.window.showInformationMessage(`${this.configFileName} created in workspace root.`);
      this.loadConfig();
      return true;
    } catch (error) {
      this.logger.error(`Failed to create ${this.configFileName}`, error);
      vscode.window.showErrorMessage(`Failed to create ${this.configFileName}. See logs for details.`);
      return false;
    }
  }
}

