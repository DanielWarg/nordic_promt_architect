import * as vscode from 'vscode';
import { Logger } from './ui/Logger';
import { ViewManager } from './ui/ViewManager';
import { ConfigurationService } from './config/configuration';
import { Sanitizer } from './security/Sanitizer';
import { CrystallizeEngine } from './core/CrystallizeEngine';
import { ArchitectEngine } from './core/ArchitectEngine';
import { VerifyEngine } from './core/VerifyEngine';

/**
 * Activate extension
 */
export function activate(context: vscode.ExtensionContext): void {
  // Create singleton instances
  const logger = new Logger();
  logger.info('Nordic Prompt Architect initializing...');
  const configService = new ConfigurationService(logger);
  const sanitizer = new Sanitizer(logger);
  const crystallizeEngine = new CrystallizeEngine();
  const architectEngine = new ArchitectEngine();
  const verifyEngine = new VerifyEngine();

  handleFirstRun(context, configService, logger);
  logger.info('Nordic Prompt Architect activated');

  // Register Initialize Config command
  const initConfigCommand = vscode.commands.registerCommand('superprompt.initConfig', async () => {
    logger.info('Initialize Config command invoked');
    await configService.initializeConfig();
  });

  // Register Crystallize command
  const crystallizeCommand = vscode.commands.registerCommand('superprompt.crystallize', async () => {
    logger.info('Crystallize command invoked');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const selection = editor.document.getText(editor.selection);
    if (!selection) {
      vscode.window.showWarningMessage('No text selected');
      return;
    }

    const LARGE_SELECTION_THRESHOLD = 100000;
    if (selection.length > LARGE_SELECTION_THRESHOLD) {
      const proceed = await vscode.window.showWarningMessage(
        `You have selected ${selection.length.toLocaleString()} characters. This may take a while. Continue?`,
        'Continue',
        'Cancel'
      );
      if (proceed !== 'Continue') {
        return;
      }
      logger.warn(`Processing large selection: ${selection.length} characters`);
    }

    try {
      const config = configService.getConfig();
      const result = crystallizeEngine.run(selection, config);
      await ViewManager.openMarkdown(result);
      logger.info('Crystallize completed successfully');
    } catch (error) {
      logger.error('Crystallize failed', error instanceof Error ? error : new Error(String(error)));
      vscode.window.showErrorMessage('Crystallize failed. Check logs for details.');
    }
  });

  // Register Architect command
  const architectCommand = vscode.commands.registerCommand('superprompt.architect', async () => {
    logger.info('Architect command invoked');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const selection = editor.document.getText(editor.selection);
    if (!selection) {
      vscode.window.showWarningMessage('No code selected');
      return;
    }

    const LARGE_SELECTION_THRESHOLD = 100000;
    if (selection.length > LARGE_SELECTION_THRESHOLD) {
      const proceed = await vscode.window.showWarningMessage(
        `You have selected ${selection.length.toLocaleString()} characters. This may take a while. Continue?`,
        'Continue',
        'Cancel'
      );
      if (proceed !== 'Continue') {
        return;
      }
      logger.warn(`Processing large selection: ${selection.length} characters`);
    }

    try {
      const config = configService.getConfig();
      const filePath = editor.document.uri.fsPath;
      const sanitizerResult = sanitizer.sanitize(
        selection,
        config.security.mask_patterns,
        config.security.exclude_paths ?? [],
        filePath
      );
      const result = architectEngine.run(selection, config, sanitizerResult);
      await ViewManager.openMarkdown(result);
      logger.info('Architect completed successfully');
    } catch (error) {
      logger.error('Architect failed', error instanceof Error ? error : new Error(String(error)));
      vscode.window.showErrorMessage('Architect failed. Check logs for details.');
    }
  });

  // Register Verify command
  const verifyCommand = vscode.commands.registerCommand('superprompt.verify', async () => {
    logger.info('Verify command invoked');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const selection = editor.document.getText(editor.selection);
    if (!selection) {
      vscode.window.showWarningMessage('No spec text selected');
      return;
    }

    const LARGE_SELECTION_THRESHOLD = 100000;
    if (selection.length > LARGE_SELECTION_THRESHOLD) {
      const proceed = await vscode.window.showWarningMessage(
        `You have selected ${selection.length.toLocaleString()} characters. This may take a while. Continue?`,
        'Continue',
        'Cancel'
      );
      if (proceed !== 'Continue') {
        return;
      }
      logger.warn(`Processing large selection: ${selection.length} characters`);
    }

    try {
      const result = verifyEngine.run(selection);
      await ViewManager.openMarkdown(result);
      logger.info('Verify completed successfully');
    } catch (error) {
      logger.error('Verify failed', error instanceof Error ? error : new Error(String(error)));
      vscode.window.showErrorMessage('Verify failed. Check logs for details.');
    }
  });

  // Register Compare Selections command
  const compareSelectionsCommand = vscode.commands.registerCommand('superprompt.compareSelections', async () => {
    logger.info('Compare Selections command invoked');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const selections = editor.selections.filter(sel => !sel.isEmpty);
    if (selections.length !== 2) {
      vscode.window.showWarningMessage('Select exactly two text blocks to compare.');
      return;
    }

    const [firstText, secondText] = selections.map(sel => editor.document.getText(sel));

    const totalLength = firstText.length + secondText.length;
    const LARGE_SELECTION_THRESHOLD = 100000;
    if (totalLength > LARGE_SELECTION_THRESHOLD) {
      const proceed = await vscode.window.showWarningMessage(
        `You are comparing ${totalLength.toLocaleString()} characters. This may take a while. Continue?`,
        'Continue',
        'Cancel'
      );
      if (proceed !== 'Continue') {
        return;
      }
      logger.warn(`Processing large compare: ${totalLength} characters`);
    }

    try {
      const content = [
        '# TEKNISK ANALYS – JÄMFÖRELSE',
        '',
        '## Skillnader och fokus',
        '- [Fyll i skillnader här]',
        '',
        '## Version A',
        '',
        '```text',
        firstText,
        '```',
        '',
        '---',
        '',
        '## Version B',
        '',
        '```text',
        secondText,
        '```',
        '',
        '---',
        '',
        '## Rekommenderad riktning',
        '',
        '- [Fyll i rekommendation här]',
        ''
      ].join('\n');

      await ViewManager.openMarkdown(content);
      logger.info('Compare Selections completed successfully');
    } catch (error) {
      logger.error('Compare Selections failed', error instanceof Error ? error : new Error(String(error)));
      vscode.window.showErrorMessage('Compare failed. Check logs for details.');
    }
  });

  const analyzeSafetyCommand = vscode.commands.registerCommand('superprompt.analyzeSafety', async () => {
    logger.info('Analyze Safety command invoked');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const selection = editor.document.getText(editor.selection);
    if (!selection) {
      vscode.window.showWarningMessage('No text selected');
      return;
    }

    try {
      const config = configService.getConfig();
      const analysis = sanitizer.analyze(selection, config.security.mask_patterns);
      if (Object.keys(analysis.matches).length === 0) {
        logger.info('Safety analysis: No sensitive data detected.');
      } else {
        for (const [label, count] of Object.entries(analysis.matches)) {
          logger.info(`Safety analysis: ${count} ${label}${count > 1 ? ' entries' : ' entry'} detected.`);
        }
      }
      vscode.window.showInformationMessage('Safety analysis complete — see Nordic Prompt Logs for details.');
    } catch (error) {
      logger.error('Analyze Safety failed', error instanceof Error ? error : new Error(String(error)));
      vscode.window.showErrorMessage('Analyze Safety failed. Check logs for details.');
    }
  });

  context.subscriptions.push(
    initConfigCommand,
    crystallizeCommand,
    architectCommand,
    verifyCommand,
    compareSelectionsCommand,
    analyzeSafetyCommand,
    configService,
    logger
  );
}

function handleFirstRun(
  context: vscode.ExtensionContext,
  configService: ConfigurationService,
  logger: Logger
): void {
  const FIRST_RUN_KEY = 'npa.firstRunCompleted';
  const hasRunBefore = context.globalState.get<boolean>(FIRST_RUN_KEY, false);

  if (hasRunBefore) {
    if (configService.isUsingDefaults()) {
      logger.warn('Running with secure defaults. Consider initializing project config.');
    }
    return;
  }

  const message = configService.isUsingDefaults()
    ? "Nordic Prompt Architect installed. Using secure defaults. Run 'SuperPrompt: Initialize Config' to create .superpromptrc.json."
    : "Nordic Prompt Architect installed. Run 'SuperPrompt: Initialize Config' to customize .superpromptrc.json.";

  vscode.window.showInformationMessage(message);
  logger.info('First run onboarding message shown.');
  void context.globalState.update(FIRST_RUN_KEY, true);
}

/**
 * Deactivate extension
 */
export function deactivate(): void {
  // Cleanup if needed
}
