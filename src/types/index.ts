// Core Message Types
export interface Message {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: number;
    agentType?: 'conversational' | 'codeGeneration';
}

// Agent State Types
export interface ConversationState {
    messages: Message[];
    userIntent: string;
    needsClarification: boolean;
    clarificationQuestions: string[];
    refinedPrompt: string;
}

export interface CodeGenerationState {
    generatedCode: string;
    language: string;
    explanation: string;
    executionResult?: ExecutionResult;
}

// Execution Types
export interface ExecutionResult {
    success: boolean;
    output: string;
    error?: string;
    logs: string[];
    executionTime: number;
}

// LLM Provider Types
export type LLMProvider = 'openai' | 'anthropic' | 'google' | 'ollama';

export interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LLMResponse {
    content: string;
    usage: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface LLMConfig {
    provider: LLMProvider;
    model: string;
    apiKey: string;
    baseUrl?: string;
    temperature?: number;
    maxTokens?: number;
}

// Agent Communication Types
export interface AgentMessage {
    conversationId: string;
    userIntent: string;
    refinedRequirements: {
        techStack: string[];
        features: string[];
        database?: string;
        additionalConstraints: string[];
    };
    clarifications: Array<{
        question: string;
        answer: string;
    }>;
    priority: 'low' | 'medium' | 'high';
    estimatedComplexity: 'simple' | 'medium' | 'complex';
}

// File System Types
export interface FileNode {
    name: string;
    type: 'file' | 'folder';
    path: string;
    content?: string;
    children?: FileNode[];
    lastModified?: number;
    size?: number;
}

export interface FileSystemState {
    files: FileNode[];
    currentFile: string | null;
    projectStructure: FileNode[];
}

// UI State Types
export interface UIState {
    theme: 'light' | 'dark';
    activePanel: 'chat' | 'editor' | 'execution' | 'files';
    sidebarCollapsed: boolean;
    isLoading: boolean;
    error: string | null;
}

// Application State (Zustand Store)
export interface AppState {
    // Conversation
    messages: Message[];
    userIntent: string;
    needsClarification: boolean;
    clarificationQuestions: string[];
    refinedPrompt: string;

    // Code
    generatedCode: string;
    codeLanguage: string;
    executionResult: ExecutionResult | null;
    isExecuting: boolean;

    // File System
    files: FileNode[];
    currentFile: string | null;
    projectStructure: FileNode[];

    // UI
    theme: 'light' | 'dark';
    activePanel: 'chat' | 'editor' | 'execution' | 'files';
    sidebarCollapsed: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    addMessage: (message: Message) => void;
    clearMessages: () => void;
    setUserIntent: (intent: string) => void;
    setNeedsClarification: (needs: boolean) => void;
    setClarificationQuestions: (questions: string[]) => void;
    setRefinedPrompt: (prompt: string) => void;
    setGeneratedCode: (code: string, language: string) => void;
    setExecutionResult: (result: ExecutionResult) => void;
    setIsExecuting: (executing: boolean) => void;
    setCurrentFile: (filePath: string | null) => void;
    addFile: (file: FileNode) => void;
    updateFile: (path: string, content: string) => void;
    deleteFile: (path: string) => void;
    setTheme: (theme: 'light' | 'dark') => void;
    setActivePanel: (panel: 'chat' | 'editor' | 'execution' | 'files') => void;
    setSidebarCollapsed: (collapsed: boolean) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

// Service Types
export interface LLMService {
    chat(
        provider: LLMProvider,
        model: string,
        messages: LLMMessage[],
        options?: ChatOptions
    ): Promise<LLMResponse | AsyncIterable<string>>;
}

export interface ChatOptions {
    stream?: boolean;
    temperature?: number;
    maxTokens?: number;
}

export interface SandboxService {
    executeCode(
        code: string,
        language: string,
        options?: ExecutionOptions
    ): Promise<ExecutionResult>;
}

export interface ExecutionOptions {
    timeout?: number;
    memoryLimit?: number;
    allowNetworkAccess?: boolean;
    allowFileSystemAccess?: boolean;
}

export interface FileSystemService {
    createFile(path: string, content: string): Promise<void>;
    readFile(path: string): Promise<string>;
    updateFile(path: string, content: string): Promise<void>;
    deleteFile(path: string): Promise<void>;
    listFiles(directory?: string): Promise<FileNode[]>;
    createDirectory(path: string): Promise<void>;
    deleteDirectory(path: string): Promise<void>;
}

// Agent Types
export interface ConversationalAgent {
    processMessage(message: string, context: ConversationState): Promise<AgentMessage>;
    generateClarificationQuestions(intent: string): Promise<string[]>;
    refinePrompt(conversation: Message[]): Promise<string>;
}

export interface CodeGenerationAgent {
    generateCode(prompt: string, language: string): Promise<CodeGenerationState>;
    validateCode(code: string, language: string): Promise<boolean>;
    formatCode(code: string, language: string): Promise<string>;
}

export interface ExecutionAgent {
    executeCode(code: string, language: string): Promise<ExecutionResult>;
    validateExecution(code: string, language: string): Promise<boolean>;
}

// Workflow Types (LangGraph)
export interface WorkflowState {
    messages: Message[];
    userIntent: string;
    needsClarification: boolean;
    clarificationQuestions: string[];
    refinedPrompt: string;
    generatedCode: string;
    codeLanguage: string;
    executionResult: ExecutionResult | null;
    shouldContinue: boolean;
}

export interface WorkflowNode {
    name: string;
    execute: (state: WorkflowState) => Promise<Partial<WorkflowState>>;
}

export interface WorkflowEdge {
    from: string;
    to: string;
    condition?: (state: WorkflowState) => boolean;
}

// Error Types
export interface AppError {
    code: string;
    message: string;
    details?: any;
    timestamp: number;
}

export interface ValidationError {
    field: string;
    message: string;
    value: any;
}

// Configuration Types
export interface AppConfig {
    llm: {
        defaultProvider: LLMProvider;
        models: Record<LLMProvider, string[]>;
        apiKeys: Record<LLMProvider, string>;
    };
    execution: {
        timeout: number;
        memoryLimit: number;
        allowedLanguages: string[];
    };
    ui: {
        defaultTheme: 'light' | 'dark';
        defaultLanguage: string;
        autoSave: boolean;
    };
}

// Event Types
export interface AppEvent {
    type: string;
    payload: any;
    timestamp: number;
}

export interface MessageEvent extends AppEvent {
    type: 'message' | 'code_generated' | 'execution_complete';
    payload: Message | CodeGenerationState | ExecutionResult;
}

// Utility Types
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
