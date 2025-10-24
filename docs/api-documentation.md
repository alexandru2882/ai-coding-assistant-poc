# API Documentation

## Overview

This document provides comprehensive API documentation for all services and agents in the AI Coding Assistant application. The APIs are designed to be type-safe, well-documented, and easy to use.

## Service APIs

### LLM Provider Service

The LLM Provider Service provides a unified interface for multiple language model providers.

```typescript
// src/services/llm-provider.ts
interface LLMProviderService {
  /**
   * Send a chat message to the specified LLM provider
   * @param provider - The LLM provider to use
   * @param model - The specific model to use
   * @param messages - Array of messages in the conversation
   * @param options - Optional configuration for the request
   * @returns Promise resolving to LLM response or streaming iterator
   */
  chat(
    provider: LLMProvider,
    model: string,
    messages: LLMMessage[],
    options?: ChatOptions
  ): Promise<LLMResponse | AsyncIterable<string>>;
  
  /**
   * Get available models for a provider
   * @param provider - The LLM provider
   * @returns Array of available model names
   */
  getAvailableModels(provider: LLMProvider): Promise<string[]>;
  
  /**
   * Check if a provider is configured and available
   * @param provider - The LLM provider
   * @returns Boolean indicating if provider is available
   */
  isProviderAvailable(provider: LLMProvider): boolean;
  
  /**
   * Get usage statistics for a provider
   * @param provider - The LLM provider
   * @returns Usage statistics object
   */
  getUsageStats(provider: LLMProvider): Promise<UsageStats>;
}

interface ChatOptions {
  stream?: boolean;
  temperature?: number;
  maxTokens?: number;
  timeout?: number;
  retries?: number;
}

interface UsageStats {
  totalRequests: number;
  totalTokens: number;
  totalCost: number;
  averageResponseTime: number;
}
```

#### Usage Examples

```typescript
// Basic chat usage
const response = await llmService.chat(
  'openai',
  'gpt-3.5-turbo',
  [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, how are you?' }
  ]
);

// Streaming chat usage
const stream = await llmService.chat(
  'openai',
  'gpt-3.5-turbo',
  messages,
  { stream: true }
) as AsyncIterable<string>;

for await (const chunk of stream) {
  console.log(chunk);
}

// Check provider availability
if (llmService.isProviderAvailable('anthropic')) {
  const models = await llmService.getAvailableModels('anthropic');
  console.log('Available Anthropic models:', models);
}
```

### Sandbox Service

The Sandbox Service provides secure code execution capabilities.

```typescript
// src/services/sandbox.ts
interface SandboxService {
  /**
   * Execute code in a secure sandbox environment
   * @param code - The code to execute
   * @param language - The programming language
   * @param options - Execution options
   * @returns Promise resolving to execution result
   */
  executeCode(
    code: string,
    language: string,
    options?: ExecutionOptions
  ): Promise<ExecutionResult>;
  
  /**
   * Create a new sandbox session
   * @param options - Sandbox configuration
   * @returns Promise resolving to sandbox session ID
   */
  createSession(options?: SandboxOptions): Promise<string>;
  
  /**
   * Execute code in an existing session
   * @param sessionId - The sandbox session ID
   * @param code - The code to execute
   * @param language - The programming language
   * @returns Promise resolving to execution result
   */
  executeInSession(
    sessionId: string,
    code: string,
    language: string
  ): Promise<ExecutionResult>;
  
  /**
   * Close a sandbox session
   * @param sessionId - The sandbox session ID
   * @returns Promise resolving when session is closed
   */
  closeSession(sessionId: string): Promise<void>;
  
  /**
   * Get sandbox status
   * @param sessionId - The sandbox session ID
   * @returns Promise resolving to sandbox status
   */
  getSessionStatus(sessionId: string): Promise<SandboxStatus>;
}

interface ExecutionOptions {
  timeout?: number;
  memoryLimit?: number;
  allowNetworkAccess?: boolean;
  allowFileSystemAccess?: boolean;
  environment?: Record<string, string>;
}

interface SandboxOptions {
  language: string;
  timeout?: number;
  memoryLimit?: number;
  allowNetworkAccess?: boolean;
  allowFileSystemAccess?: boolean;
  environment?: Record<string, string>;
}

interface SandboxStatus {
  id: string;
  status: 'running' | 'stopped' | 'error';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
}
```

#### Usage Examples

```typescript
// Basic code execution
const result = await sandboxService.executeCode(
  'console.log("Hello, World!");',
  'javascript',
  {
    timeout: 30000,
    memoryLimit: 512 * 1024 * 1024, // 512MB
    allowNetworkAccess: false
  }
);

// Session-based execution
const sessionId = await sandboxService.createSession({
  language: 'python',
  timeout: 60000,
  allowFileSystemAccess: true
});

const result = await sandboxService.executeInSession(
  sessionId,
  'import pandas as pd\nprint(pd.__version__)',
  'python'
);

await sandboxService.closeSession(sessionId);
```

### File System Service

The File System Service manages virtual file operations.

```typescript
// src/services/file-system.ts
interface FileSystemService {
  /**
   * Create a new file
   * @param path - The file path
   * @param content - The file content
   * @returns Promise resolving when file is created
   */
  createFile(path: string, content: string): Promise<void>;
  
  /**
   * Read file content
   * @param path - The file path
   * @returns Promise resolving to file content
   */
  readFile(path: string): Promise<string>;
  
  /**
   * Update file content
   * @param path - The file path
   * @param content - The new file content
   * @returns Promise resolving when file is updated
   */
  updateFile(path: string, content: string): Promise<void>;
  
  /**
   * Delete a file
   * @param path - The file path
   * @returns Promise resolving when file is deleted
   */
  deleteFile(path: string): Promise<void>;
  
  /**
   * List files in a directory
   * @param directory - The directory path (optional, defaults to root)
   * @returns Promise resolving to array of file nodes
   */
  listFiles(directory?: string): Promise<FileNode[]>;
  
  /**
   * Create a directory
   * @param path - The directory path
   * @returns Promise resolving when directory is created
   */
  createDirectory(path: string): Promise<void>;
  
  /**
   * Delete a directory
   * @param path - The directory path
   * @returns Promise resolving when directory is deleted
   */
  deleteDirectory(path: string): Promise<void>;
  
  /**
   * Check if a path exists
   * @param path - The path to check
   * @returns Promise resolving to boolean
   */
  exists(path: string): Promise<boolean>;
  
  /**
   * Get file metadata
   * @param path - The file path
   * @returns Promise resolving to file metadata
   */
  getMetadata(path: string): Promise<FileMetadata>;
  
  /**
   * Search for files
   * @param query - The search query
   * @param options - Search options
   * @returns Promise resolving to array of matching files
   */
  searchFiles(query: string, options?: SearchOptions): Promise<FileNode[]>;
}

interface FileMetadata {
  path: string;
  size: number;
  lastModified: number;
  type: 'file' | 'directory';
  permissions: string;
}

interface SearchOptions {
  includeContent?: boolean;
  caseSensitive?: boolean;
  fileTypes?: string[];
  maxResults?: number;
}
```

#### Usage Examples

```typescript
// Create a new file
await fileSystemService.createFile(
  'src/index.js',
  'console.log("Hello, World!");'
);

// Read file content
const content = await fileSystemService.readFile('src/index.js');

// List all files
const files = await fileSystemService.listFiles();

// Search for files
const results = await fileSystemService.searchFiles(
  'function',
  {
    includeContent: true,
    fileTypes: ['js', 'ts'],
    maxResults: 10
  }
);
```

## Agent APIs

### Conversational Agent

The Conversational Agent handles user interaction and requirement gathering.

```typescript
// src/agents/conversational-agent.ts
interface ConversationalAgent {
  /**
   * Process a user message and determine the next action
   * @param message - The user message
   * @param context - The conversation context
   * @returns Promise resolving to agent response
   */
  processMessage(
    message: string,
    context: ConversationContext
  ): Promise<ConversationalAgentResponse>;
  
  /**
   * Generate clarification questions for unclear requirements
   * @param intent - The user intent
   * @param context - The conversation context
   * @returns Promise resolving to array of questions
   */
  generateClarificationQuestions(
    intent: string,
    context: ConversationContext
  ): Promise<string[]>;
  
  /**
   * Refine a user prompt into a structured format
   * @param conversation - The conversation history
   * @param intent - The user intent
   * @returns Promise resolving to refined prompt
   */
  refinePrompt(
    conversation: Message[],
    intent: string
  ): Promise<RefinedPrompt>;
  
  /**
   * Analyze user intent from a message
   * @param message - The user message
   * @param context - The conversation context
   * @returns Promise resolving to intent analysis
   */
  analyzeIntent(
    message: string,
    context: ConversationContext
  ): Promise<IntentAnalysis>;
}

interface ConversationContext {
  messages: Message[];
  userProfile: UserProfile;
  projectContext: ProjectContext;
  preferences: UserPreferences;
}

interface UserProfile {
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguages: string[];
  codingStyle: string;
  interests: string[];
}

interface ProjectContext {
  type: string;
  technologies: string[];
  structure: FileNode[];
  currentFile: string | null;
}

interface UserPreferences {
  responseStyle: 'concise' | 'detailed' | 'technical';
  language: string;
  theme: string;
  autoSave: boolean;
}

interface ConversationalAgentResponse {
  type: 'clarification' | 'refinement' | 'response';
  content: string;
  needsClarification: boolean;
  clarificationQuestions?: string[];
  refinedPrompt?: RefinedPrompt;
  confidence: number;
  suggestedActions: string[];
}

interface RefinedPrompt {
  originalIntent: string;
  structuredRequirements: {
    functional: string[];
    nonFunctional: string[];
    constraints: string[];
  };
  technicalSpecs: {
    language: string;
    framework?: string;
    architecture: string;
    patterns: string[];
  };
  qualityRequirements: {
    testing: boolean;
    documentation: boolean;
    performance: string;
    security: string;
  };
}

interface IntentAnalysis {
  primary: string;
  secondary: string[];
  confidence: number;
  complexity: 'simple' | 'medium' | 'complex';
  estimatedTime: number;
  requiredSkills: string[];
}
```

#### Usage Examples

```typescript
// Process a user message
const response = await conversationalAgent.processMessage(
  'I want to build a REST API for user authentication',
  {
    messages: conversationHistory,
    userProfile: userProfile,
    projectContext: projectContext,
    preferences: userPreferences
  }
);

// Generate clarification questions
const questions = await conversationalAgent.generateClarificationQuestions(
  'Build me a website',
  conversationContext
);

// Refine a prompt
const refinedPrompt = await conversationalAgent.refinePrompt(
  conversationHistory,
  'Create a React component for user login'
);
```

### Code Generation Agent

The Code Generation Agent handles technical implementation and code synthesis.

```typescript
// src/agents/code-generation-agent.ts
interface CodeGenerationAgent {
  /**
   * Generate code based on a refined prompt
   * @param prompt - The refined prompt
   * @param context - The generation context
   * @returns Promise resolving to generated code
   */
  generateCode(
    prompt: RefinedPrompt,
    context: GenerationContext
  ): Promise<CodeGenerationResult>;
  
  /**
   * Validate generated code
   * @param code - The code to validate
   * @param language - The programming language
   * @returns Promise resolving to validation result
   */
  validateCode(
    code: string,
    language: string
  ): Promise<ValidationResult>;
  
  /**
   * Format and optimize code
   * @param code - The code to format
   * @param language - The programming language
   * @param options - Formatting options
   * @returns Promise resolving to formatted code
   */
  formatCode(
    code: string,
    language: string,
    options?: FormatOptions
  ): Promise<string>;
  
  /**
   * Generate tests for code
   * @param code - The code to test
   * @param language - The programming language
   * @returns Promise resolving to test code
   */
  generateTests(
    code: string,
    language: string
  ): Promise<string>;
  
  /**
   * Generate documentation for code
   * @param code - The code to document
   * @param language - The programming language
   * @returns Promise resolving to documentation
   */
  generateDocumentation(
    code: string,
    language: string
  ): Promise<string>;
}

interface GenerationContext {
  projectType: string;
  existingCode?: string;
  dependencies?: string[];
  requirements: RefinedPrompt;
  preferences: GenerationPreferences;
}

interface GenerationPreferences {
  style: 'functional' | 'object-oriented' | 'procedural';
  complexity: 'simple' | 'moderate' | 'advanced';
  testing: boolean;
  documentation: boolean;
  comments: boolean;
}

interface CodeGenerationResult {
  code: string;
  language: string;
  explanation: string;
  metadata: {
    complexity: 'simple' | 'medium' | 'complex';
    estimatedTime: number;
    dependencies: string[];
    testCoverage: number;
  };
  suggestions: {
    improvements: string[];
    alternatives: string[];
    nextSteps: string[];
  };
  files: GeneratedFile[];
}

interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  type: 'source' | 'test' | 'documentation' | 'config';
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: string[];
}

interface ValidationError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationWarning {
  line: number;
  column: number;
  message: string;
  suggestion?: string;
}

interface FormatOptions {
  indentSize: number;
  useTabs: boolean;
  lineLength: number;
  trailingCommas: boolean;
  semicolons: boolean;
}
```

#### Usage Examples

```typescript
// Generate code
const result = await codeGenerationAgent.generateCode(
  refinedPrompt,
  {
    projectType: 'web-application',
    existingCode: existingCode,
    dependencies: ['react', 'typescript'],
    requirements: refinedPrompt,
    preferences: {
      style: 'functional',
      complexity: 'moderate',
      testing: true,
      documentation: true,
      comments: true
    }
  }
);

// Validate code
const validation = await codeGenerationAgent.validateCode(
  generatedCode,
  'typescript'
);

// Format code
const formattedCode = await codeGenerationAgent.formatCode(
  generatedCode,
  'typescript',
  {
    indentSize: 2,
    useTabs: false,
    lineLength: 80,
    trailingCommas: true,
    semicolons: true
  }
);
```

### Execution Agent

The Execution Agent handles code execution and testing.

```typescript
// src/agents/execution-agent.ts
interface ExecutionAgent {
  /**
   * Execute code in a sandbox environment
   * @param code - The code to execute
   * @param language - The programming language
   * @param options - Execution options
   * @returns Promise resolving to execution result
   */
  executeCode(
    code: string,
    language: string,
    options?: ExecutionOptions
  ): Promise<ExecutionResult>;
  
  /**
   * Validate code before execution
   * @param code - The code to validate
   * @param language - The programming language
   * @returns Promise resolving to validation result
   */
  validateExecution(
    code: string,
    language: string
  ): Promise<ValidationResult>;
  
  /**
   * Run tests for code
   * @param code - The code to test
   * @param testCode - The test code
   * @param language - The programming language
   * @returns Promise resolving to test results
   */
  runTests(
    code: string,
    testCode: string,
    language: string
  ): Promise<TestResult>;
  
  /**
   * Get execution environment info
   * @param language - The programming language
   * @returns Promise resolving to environment info
   */
  getEnvironmentInfo(language: string): Promise<EnvironmentInfo>;
}

interface ExecutionOptions {
  timeout?: number;
  memoryLimit?: number;
  allowNetworkAccess?: boolean;
  allowFileSystemAccess?: boolean;
  environment?: Record<string, string>;
  input?: string;
}

interface TestResult {
  passed: boolean;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  testResults: TestCaseResult[];
  coverage: number;
  executionTime: number;
}

interface TestCaseResult {
  name: string;
  passed: boolean;
  error?: string;
  executionTime: number;
}

interface EnvironmentInfo {
  language: string;
  version: string;
  availablePackages: string[];
  systemInfo: {
    os: string;
    architecture: string;
    memory: number;
    cpu: string;
  };
}
```

#### Usage Examples

```typescript
// Execute code
const result = await executionAgent.executeCode(
  'console.log("Hello, World!");',
  'javascript',
  {
    timeout: 30000,
    memoryLimit: 512 * 1024 * 1024,
    allowNetworkAccess: false
  }
);

// Run tests
const testResult = await executionAgent.runTests(
  sourceCode,
  testCode,
  'javascript'
);

// Get environment info
const envInfo = await executionAgent.getEnvironmentInfo('python');
console.log('Python version:', envInfo.version);
```

## Workflow Orchestration

### LangGraph Workflow

The workflow orchestrates the interaction between different agents.

```typescript
// src/agents/workflow.ts
interface WorkflowOrchestrator {
  /**
   * Execute the complete workflow
   * @param input - The workflow input
   * @returns Promise resolving to workflow result
   */
  execute(input: WorkflowInput): Promise<WorkflowResult>;
  
  /**
   * Get workflow status
   * @param workflowId - The workflow ID
   * @returns Promise resolving to workflow status
   */
  getStatus(workflowId: string): Promise<WorkflowStatus>;
  
  /**
   * Cancel a running workflow
   * @param workflowId - The workflow ID
   * @returns Promise resolving when workflow is cancelled
   */
  cancel(workflowId: string): Promise<void>;
}

interface WorkflowInput {
  userMessage: string;
  context: WorkflowContext;
  options: WorkflowOptions;
}

interface WorkflowContext {
  conversationHistory: Message[];
  projectContext: ProjectContext;
  userProfile: UserProfile;
  preferences: UserPreferences;
}

interface WorkflowOptions {
  maxClarifications: number;
  timeout: number;
  retries: number;
  quality: 'draft' | 'production' | 'optimized';
}

interface WorkflowResult {
  success: boolean;
  messages: Message[];
  generatedCode: string;
  executionResult: ExecutionResult | null;
  metadata: WorkflowMetadata;
}

interface WorkflowMetadata {
  duration: number;
  steps: WorkflowStep[];
  clarifications: number;
  quality: number;
}

interface WorkflowStep {
  name: string;
  duration: number;
  success: boolean;
  error?: string;
}

interface WorkflowStatus {
  id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  currentStep: string;
  progress: number;
  startTime: number;
  endTime?: number;
}
```

#### Usage Examples

```typescript
// Execute workflow
const result = await workflowOrchestrator.execute({
  userMessage: 'Create a React component for user authentication',
  context: {
    conversationHistory: messages,
    projectContext: projectContext,
    userProfile: userProfile,
    preferences: userPreferences
  },
  options: {
    maxClarifications: 3,
    timeout: 300000, // 5 minutes
    retries: 2,
    quality: 'production'
  }
});

// Check workflow status
const status = await workflowOrchestrator.getStatus(workflowId);
console.log('Workflow status:', status.status);
console.log('Progress:', status.progress + '%');
```

## Error Handling

### Error Types

```typescript
// src/types/errors.ts
interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  context: ErrorContext;
}

interface ErrorContext {
  component: string;
  action: string;
  userId?: string;
  sessionId?: string;
}

// Specific error types
class LLMError extends Error {
  constructor(
    message: string,
    public provider: LLMProvider,
    public model: string,
    public code: string
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

class SandboxError extends Error {
  constructor(
    message: string,
    public sessionId: string,
    public code: string
  ) {
    super(message);
    this.name = 'SandboxError';
  }
}

class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value: any
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

### Error Handling Strategy

```typescript
// src/utils/error-handler.ts
interface ErrorHandler {
  handle(error: Error): Promise<ErrorResponse>;
  retry<T>(operation: () => Promise<T>, options: RetryOptions): Promise<T>;
  log(error: AppError): Promise<void>;
}

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  suggestions: string[];
}

interface RetryOptions {
  maxAttempts: number;
  delay: number;
  backoff: 'linear' | 'exponential';
  condition?: (error: Error) => boolean;
}
```

---

**Document Version**: 1.0  
**Last Updated**: October 24, 2025  
**Status**: Draft - Ready for Implementation
