import * as vscode from 'vscode';
import { Logger } from './ui/Logger';
import { ViewManager } from './ui/ViewManager';
import { MenuService } from './ui/Menus';
import { ConfigurationService } from './config/configuration';
import { Sanitizer } from './security/Sanitizer';
import { CrystallizeEngine } from './core/CrystallizeEngine';
import { ArchitectEngine } from './core/ArchitectEngine';
import { VerifyEngine } from './core/VerifyEngine';
import { CompareAnalyzer } from './core/text-analysis/CompareAnalyzer';

/**
 * Activate extension
 */
export function activate(context: vscode.ExtensionContext): void {
  // Create singleton instances
  const logger = new Logger();
  logger.info('Nordic Prompt Architect initializing...');
  const configService = new ConfigurationService(logger);
  const sanitizer = new Sanitizer(logger);
  const crystallizeEngine = new CrystallizeEngine(logger);
  const architectEngine = new ArchitectEngine();
  const verifyEngine = new VerifyEngine();
  const compareAnalyzer = new CompareAnalyzer();

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
      // Use generateTechSpec for backward compatibility
      const result = crystallizeEngine.generateTechSpec(selection, config);
      await ViewManager.openMarkdown(result);
      logger.info('Crystallize completed successfully');
    } catch (error) {
      logger.error('Crystallize failed', error instanceof Error ? error : new Error(String(error)));
      vscode.window.showErrorMessage('Crystallize failed. Check logs for details.');
    }
  });

  // Register Crystallize Spec command
  const crystallizeSpecCommand = vscode.commands.registerCommand('superprompt.crystallizeSpec', async () => {
    logger.info('Crystallize Spec command invoked');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const selection = editor.document.getText(editor.selection);
    if (!selection || selection.trim().length === 0) {
      vscode.window.showWarningMessage('No text selected or selection is empty');
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
      const result = crystallizeEngine.generateTechSpec(selection, config);
      await ViewManager.openMarkdown(result);
      logger.info('Crystallize Spec completed successfully');
    } catch (error) {
      logger.error('Crystallize Spec failed', error instanceof Error ? error : new Error(String(error)));
      vscode.window.showErrorMessage('Crystallize Spec failed. Check logs for details.');
    }
  });

  // Register Crystallize Diplomat command
  const crystallizeDiplomatCommand = vscode.commands.registerCommand('superprompt.crystallizeDiplomat', async () => {
    logger.info('Crystallize Diplomat command invoked');

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage('No active editor found');
      return;
    }

    const selection = editor.document.getText(editor.selection);
    if (!selection || selection.trim().length === 0) {
      vscode.window.showWarningMessage('No text selected or selection is empty');
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
      const result = crystallizeEngine.generateDiplomat(selection, config);
      await ViewManager.openMarkdown(result);
      logger.info('Crystallize Diplomat completed successfully');
    } catch (error) {
      logger.error('Crystallize Diplomat failed', error instanceof Error ? error : new Error(String(error)));
      vscode.window.showErrorMessage('Crystallize Diplomat failed. Check logs for details.');
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
      const config = configService.getConfig();
      const analysis = compareAnalyzer.analyzeCompare(firstText, secondText, config);
      
      const lang = config.project.language === 'en' ? 'en' : 'sv';
      const isSv = lang === 'sv';

      // Build markdown content with analysis
      const contentLines: string[] = [];

      // Header
      contentLines.push(isSv ? '# TEKNISK ANALYS – JÄMFÖRELSE' : '# TECHNICAL ANALYSIS – COMPARISON');
      contentLines.push('');

      // Summaries
      contentLines.push('## ' + (isSv ? 'Sammanfattning' : 'Summary'));
      contentLines.push('');
      contentLines.push('**' + (isSv ? 'Version A' : 'Version A') + ':**');
      contentLines.push(analysis.summaryA);
      contentLines.push('');
      contentLines.push('**' + (isSv ? 'Version B' : 'Version B') + ':**');
      contentLines.push(analysis.summaryB);
      contentLines.push('');

      // Main differences
      contentLines.push('## ' + (isSv ? 'Skillnader och fokus' : 'Differences and Focus'));
      contentLines.push('');
      for (const diff of analysis.mainDifferences) {
        contentLines.push(`- ${diff}`);
      }
      contentLines.push('');

      // Risk notes if any
      if (analysis.riskNotes.length > 0) {
        contentLines.push('## ' + (isSv ? 'Riskmedvetenhet' : 'Risk Awareness'));
        contentLines.push('');
        for (const risk of analysis.riskNotes) {
          contentLines.push(`- ${risk}`);
        }
        contentLines.push('');
      }

      // Version A text block
      contentLines.push('## ' + (isSv ? 'Version A' : 'Version A'));
      contentLines.push('');
      contentLines.push('```text');
      contentLines.push(firstText);
      contentLines.push('```');
      contentLines.push('');
      contentLines.push('---');
      contentLines.push('');

      // Version B text block
      contentLines.push('## ' + (isSv ? 'Version B' : 'Version B'));
      contentLines.push('');
      contentLines.push('```text');
      contentLines.push(secondText);
      contentLines.push('```');
      contentLines.push('');
      contentLines.push('---');
      contentLines.push('');

      // Recommended direction
      contentLines.push('## ' + (isSv ? 'Rekommenderad riktning' : 'Recommended Direction'));
      contentLines.push('');
      contentLines.push(analysis.recommendedDirection);
      contentLines.push('');

      const content = contentLines.join('\n');

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

  // Create MenuService instance
  const menuService = new MenuService();

  // Register menu commands
  const crystallizeMenuCommand = vscode.commands.registerCommand('superprompt.crystallizeMenu', async () => {
    logger.info('Crystallize Menu invoked');
    await menuService.showCrystallizeMenu();
  });

  const toolsMenuCommand = vscode.commands.registerCommand('superprompt.toolsMenu', async () => {
    logger.info('Developer Tools Menu invoked');
    await menuService.showDeveloperToolsMenu();
  });

  context.subscriptions.push(
    initConfigCommand,
    crystallizeCommand,
    crystallizeSpecCommand,
    crystallizeDiplomatCommand,
    architectCommand,
    verifyCommand,
    compareSelectionsCommand,
    analyzeSafetyCommand,
    crystallizeMenuCommand,
    toolsMenuCommand,
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
