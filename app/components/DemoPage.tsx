import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { FaFileAlt, FaGithub, FaBook } from 'react-icons/fa';
import { SiHuggingface } from 'react-icons/si';
import { Button } from '~/components/ui/button';
import { Card, CardContent } from '~/components/ui/card';
import { ThemeToggle } from '~/components/ui/theme-toggle';
import { LeftPane } from './LeftPane';
import { Carousel } from './Carousel';
import { App } from './App';
import { FullscreenModal } from './FullscreenModal';
import { DynamicDataProvider } from '~/context/DynamicDataContext';
import dynamicData from '~/data/dynamicData.json';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '~/styles/demo.css';

// TypeScript interfaces
interface CarouselItem {
    id: number;
    text: string;
    value: string;
}

// Update this interface to match the actual JSON structure
interface ExamplePrompts {
    short: string[];
    long: string[];
}

interface Example {
    query: string;
    oursUrl: string;
    textUrl: string;
    comment: string;
    interface: string;
    model: string;
    commentLength: number;
}

interface Suggestion {
    id: number;
    title: string;
    description: string;
    activity: string;
    oursUrl: string;
    textUrl: string;
    interface: string;
    model: string;
    chats: Array<{
        role: string;
        message: string;
    }>;
}

// Update DynamicData interface to match the actual JSON structure
interface DynamicData {
    activity: string;
    gif: string;
    carousel: CarouselItem[][];
    examples: Example[];
    textUrls: Example[];
    suggestions?: Suggestion[]; // Make it optional since JSON doesn't have it
}

// Demo screenshots from evaluation study
const screenshots = [
    { src: '/images/demo/3_image.png', caption: 'Quantum Physics Explorer learning platform with structured course navigation, progress tracking, conceptual overviews, and interactive cards for core quantum mechanics principles like wave-particle duality and entanglement.' },
    { src: '/images/demo/1_image.png', caption: 'EcoExplorer food web educational interface showing interactive ecosystem learning with drag-and-drop organism connections, step-by-step tutorials, and embedded quizzes for hands-on ecological understanding.' },
    { src: '/images/demo/2_image.png', caption: 'Technical comparison interface for REST vs GraphQL featuring tabbed navigation, side-by-side code examples, and interactive deep-dive sections for API versioning strategies and implementation approaches.' },
    { src: '/images/demo/4_image.png', caption: 'Event Poster Designer creative tool interface with comprehensive design toolkit, template library, real-time preview canvas, and detailed property controls for creating professional marketing materials.' },
];

// Create suggestions based on dynamicData examples
const createSuggestionsFromDynamicData = (hourKey: number): Suggestion[] => {
    const hourData = (dynamicData as unknown as Record<string, DynamicData>)[hourKey.toString()];
    if (!hourData || !hourData.examples) return [];

    return hourData.examples.map((example, index) => ({
        id: index + 1,
        title: example.query,
        description: `Compare ${example.interface} vs conversational UI. User feedback: "${example.comment}"`,
        activity: hourData.activity,
        oursUrl: example.oursUrl,
        textUrl: example.textUrl,
        interface: example.interface,
        model: example.model,
        chats: [
            {
                role: 'user',
                message: example.query
            },
            {
                role: 'assistant',
                message: `Here's the generative interface created for your ${hourData.activity.toLowerCase()} query. This is an actual interface from our evaluation study.

User feedback: "${example.comment}"`
            },
            {
                role: 'user',
                message: 'How does this compare to traditional chat interfaces?'
            },
            {
                role: 'assistant',
                message: `This ${example.interface.toLowerCase()} interface ${example.interface === 'UI-based' ? 'outperformed traditional chat interfaces' : 'provides alternative value compared to text-based responses'} in our evaluation study.

Key advantages include:
• **Interactive elements** that let you engage with content directly
• **Visual layouts** that organize information more effectively  
• **Task-specific components** designed for your particular use case
• **Reduced cognitive load** through structured presentation

This represents a shift from passive text consumption to active interface interaction.`
            }
        ]
    }));
};

export function DemoPage() {
    const [selectedHour, setSelectedHour] = useState(1);
    const [abstractExpanded, setAbstractExpanded] = useState(false);
    const [shotIdx, setShotIdx] = useState(0);
    const [fullscreenModal, setFullscreenModal] = useState<{
        isOpen: boolean;
        url: string;
        title: string;
    }>({
        isOpen: false,
        url: '',
        title: ''
    });
    const navigate = useNavigate();

    // Get current data based on selected hour
    const rawData = (dynamicData as unknown as Record<string, any>)[selectedHour.toString()] || {
        carousel: [],
        examples: [],
        activity: "",
        gif: ""
    };

    // Create suggestions based on current hour's dynamicData examples
    const suggestionsData: Suggestion[] = createSuggestionsFromDynamicData(selectedHour);

    // Create currentData with required suggestions property for DynamicDataContext
    const currentData = {
        activity: rawData.activity,
        gif: rawData.gif,
        carousel: rawData.carousel,
        examples: rawData.examples,
        textUrls: rawData.textUrls || [],
        suggestions: suggestionsData
    };

    const handleTimeChange = (newHour: number) => {
        setSelectedHour(newHour);
    };

    const handleExploreInterface = (suggestion: Suggestion) => {
        setFullscreenModal({
            isOpen: true,
            url: suggestion.oursUrl,
            title: `${suggestion.title} - Generative UI`
        });
    };

    const handleCloseFullscreen = () => {
        setFullscreenModal({
            isOpen: false,
            url: '',
            title: ''
        });
    };

    const toggleAbstract = () => {
        setAbstractExpanded(!abstractExpanded);
    };

    //     const codeString = `// Example: Interface Specification for Generative UI
    // {
    //   "intent": "explain quantum physics principles",
    //   "components": ["AnimatedDiagram", "InteractiveText", "ConceptQuiz"],
    //   "layout": "educational",
    //   "interactions": {
    //     "hover": "reveal_definitions",
    //     "click": "expand_concepts"
    //   },
    //   "state_machine": {
    //     "states": ["learning", "testing", "reviewing"],
    //     "transitions": {
    //       "learning -> testing": "quiz_start",
    //       "testing -> reviewing": "quiz_complete"
    //     }
    //   }
    // }`;

    return (
        <div className="mx-auto px-[5%] py-5 max-w-7xl">
            <div className="flex justify-between items-start mb-5">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-center">
                        GENERATIVE INTERFACES FOR LANGUAGE MODELS
                    </h1>
                </div>
                <div className="ml-4">
                    <ThemeToggle />
                </div>
            </div>

            {/* Authors */}
            <div className="flex flex-wrap justify-center mb-2">
                {[
                    'Jiaqi Chen*',
                    'Yanzhe Zhang*',
                    'Yutong Zhang',
                    'Yijia Shao',
                    'Diyi Yang',
                ].map((name, idx) => (
                    <div key={idx} className="mx-4 mb-2">
                        <div className="text-base font-medium">{name}</div>
                    </div>
                ))}
            </div>

            {/* Affiliation */}
            <div className="text-center mb-2">
                <div className="text-sm text-muted-foreground">Stanford University</div>
            </div>

            {/* Equal Contribution */}
            <div className="text-center mb-4">
                <div className="text-xs text-muted-foreground">* Equal contribution</div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-5">
                <Button className="flex items-center gap-2">
                    <FaFileAlt className="h-4 w-4" />
                    Paper (TODO)
                </Button>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://github.com/SALT-NLP/GenUI', '_blank')}
                >
                    <FaGithub className="h-4 w-4" />
                    GitHub
                </Button>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => window.open('https://huggingface.co/datasets/SALT-NLP/GenUI', '_blank')}
                >
                    <SiHuggingface className="h-4 w-4" />
                    Hugging Face
                </Button>
                {/* <Button className="flex items-center gap-2">
                    <FaBook className="h-4 w-4" />
                    Documentation
                </Button> */}
            </div>
            <div className="w-full rounded-lg mb-8">
                <img
                    src="/images/head.png"
                    alt="Generative Interfaces for Language Models"
                    className="w-full h-auto object-contain"
                    style={{ maxHeight: '400px' }}
                />
            </div>

            {/* Abstract Section */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <p className="leading-relaxed text-sm">
                        Large language models (LLMs) are increasingly seen as assistants, copilots, and consultants, capable of supporting a wide range of tasks through natural conversation. However, most systems remain limited to a linear request–response format, which struggles with complex interactive scenarios. This static, text-based interaction model often falls short in tasks such as multi-turn tasks or exploratory problem-solving, where users need more than a one-off answer. As a result, such interaction becomes inefficient, cognitively demanding, and misaligned with users' evolving goals. To address this, we investigate <em><strong>Generative Interfaces for Language Models</strong></em>, a paradigm where LLMs respond to user queries by proactively generating user interfaces (UIs) to enable more adaptive, interactive interactions that better support complex user goals.
                    </p>

                    {!abstractExpanded && (
                        <div className="flex justify-center mt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={toggleAbstract}
                                className="flex items-center gap-2"
                            >
                                <ChevronDown className="h-3 w-3" />
                                Expand abstract
                            </Button>
                        </div>
                    )}

                    {abstractExpanded && (
                        <>
                            <p className="leading-relaxed text-sm mt-4">
                                We implement a framework featuring structured interface-specific representations and iterative refinements that enable the gradual transformation of user queries into specialized UIs tailored for assisting each specific query. For systematic evaluation, we establish a multidimensional assessment framework that compares generative interfaces against traditional chat interfaces across diverse tasks, interaction patterns, and query types, evaluating functional, interactive, and emotional aspects of user experience. Our findings demonstrate the superior performance of generative interfaces, with a 72.0% increase in human preferences, revealing when and why users prefer generative interfaces over conversational ones.
                            </p>
                            <div className="flex justify-center mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={toggleAbstract}
                                    className="flex items-center gap-2"
                                >
                                    <ChevronUp className="h-3 w-3" />
                                    Collapse abstract
                                </Button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* First Demo Section */}
            <div className="layout mb-8">
                <div className="left-pane">
                    <LeftPane
                        selectedHour={selectedHour}
                        onTimeChange={handleTimeChange}
                        activity={currentData.activity}
                        gif={currentData.gif}
                    />
                </div>
                <div className="carousel-pane">
                    <Carousel carouselData={currentData.carousel} />
                    <p style={{ marginTop: '0px' }}>
                        Above shows evaluation results comparing generative UIs against traditional chat interfaces across 10 task categories. Each insight represents a UI/UX finding with its corresponding win rate from our human evaluation study. Drag the slider to explore how interface effectiveness varies across different application domains and interaction contexts.
                    </p>
                </div>
            </div>

            {/* What can you build section */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-4 flex items-center">
                        What can you build with Generative UIs?
                    </h3>
                    <p className="leading-relaxed text-sm">
                        Generative User Interfaces transform how users interact with AI by moving beyond simple text responses to create dynamic, interactive experiences tailored to each query. Instead of reading through long paragraphs, users can engage with structured layouts, interactive elements, and visual representations that match their specific needs and cognitive preferences.
                    </p>
                </CardContent>
            </Card>

            {/* Second Demo Section with Interface Examples */}
            <div className="layout mb-8">
                <div className="left-pane">
                    <LeftPane
                        selectedHour={selectedHour}
                        onTimeChange={handleTimeChange}
                        activity={currentData.activity}
                        gif={currentData.gif}
                    />
                </div>
                <div className="carousel-pane">
                    <DynamicDataProvider
                        selectedHour={selectedHour}
                        currentData={currentData}
                    >
                        <App
                            carouselData={currentData.carousel}
                            suggestionsData={suggestionsData}
                            onExploreInterface={handleExploreInterface}
                        />
                    </DynamicDataProvider>
                    <p style={{ marginTop: '0px' }}>
                        Browse interface examples from the current category selected in the left panel. Each example shows a direct comparison between our Generative UI and traditional text chat responses. Click "View Generative UI" to see our interactive interface in fullscreen, or "View Conversational UI" to see the traditional chat response.
                    </p>
                </div>
            </div>

            {/* Technical Details Section */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <h3 className="text-2xl font-semibold mb-6">Technical Approach</h3>
                    <p className="leading-relaxed text-sm mb-4">
                    Our Generative Interfaces infrastructure employs a multi-stage workflow. At its core is a novel design of an intermediate representation, a language that grounds and guides the generation process. We then develop a generation pipeline that maps users' input queries into the intermediate representation and decodes it into UI implementation code. The initial output is further optimized through an iterative refinement process which is guided by an adaptive reward mechanism to optimize user experience and task performance. We describe each stage in detail below.
                    </p>

                    {/* <div className="rounded-lg overflow-hidden mb-6">
                        <SyntaxHighlighter
                            language="javascript"
                            style={oneDark}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                                fontFamily: 'var(--font-mono), "IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                fontWeight: '400'
                            }}
                        >
                            {codeString}
                        </SyntaxHighlighter>
                    </div> */}

                    {/* <h3 className="text-2xl font-semibold mb-4">How it works</h3> */}

                    <div className="bg-card rounded-lg p-5">
                        <div className="w-full rounded-lg overflow-hidden">
                            <img
                                src="/images/Generative_User_Interface_Method.jpg"
                                alt="Technical Pipeline Architecture: (a) User Query processed through (b) Interface-specific Language with Finite State Machines to (c) Generated Code and UIs"
                                className="w-full h-auto object-contain"
                                style={{ maxHeight: '400px' }}
                            />
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground mb-4">
                        Generative Interfaces infrastructure
                    </p>

                    <p className="leading-relaxed text-sm mb-8">
                        Our system consists of three main stages: (1) The user query is translated into a strict Interface-specific Language that encodes an intent-extended action space. (2) On top of these generated code and rendered UI. (3) We then employ an iterative refinement mechanism with an adaptive reward function to generate robust code, which is rendered into functional user interfaces.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Evaluation Framework</h3>
                    <p className="leading-relaxed text-sm mb-8">
                        To enable systematic evaluation, we developed a comprehensive evaluation framework. This includes a diverse user task suite named User Interface eXperience (UIX), covering various scenarios, styles, and intents; a set of multi-dimensional evaluation metrics; an integrated human study. <br />
                        We construct UIX with 100 carefully curated prompts to ensure controlled experimental conditions that eliminate confounding factors such as generation speed and system reliability. This approach enables scalable, reproducible comparisons while avoiding the prohibitive costs required for large-scale free-query evaluation.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Results</h3>
                    <p className="leading-relaxed text-sm mb-4">
                        Our findings demonstrate that generative UIs significantly outperform traditional chat interfaces across multiple dimensions. Generative UIs show particular strength in tasks requiring visual explanation, structured information presentation, and interactive elements, while maintaining strong performance in cognitive load reduction and user satisfaction.
                    </p>

                    <div className="bg-card rounded-lg p-5 mb-4 max-w-4xl mx-auto">
                        <div className="w-full rounded-lg overflow-hidden">
                            <img
                                src="/images/scenarios_human_study.jpg"
                                alt="Scenario-wise Human Evaluation of Conversational vs. Generative UIs showing performance across 10 task scenarios"
                                className="w-full h-auto object-contain"
                                style={{ maxHeight: '500px' }}
                            />
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground mb-4">
                        <strong>Human Evaluation of UI Framework.</strong> Win, tie and loss percentages of UI variants compared to our system (GenUI), based on human preference across different perception dimensions: functional, interactive, and emotional.
                    </p>

                    <div className="bg-card rounded-lg p-5 mb-4 max-w-4xl mx-auto">
                        <div className="w-full rounded-lg overflow-hidden">
                            <img
                                src="/images/scenarios_human_study2.png"
                                alt="Scenario-wise human preference across 10 task scenarios"
                                className="w-full h-auto object-contain"
                                style={{ maxHeight: '500px' }}
                            />
                        </div>
                    </div>

                    <p className="text-center text-xs text-muted-foreground mb-4">
                        <strong>Scenario-wise human preference.</strong> Across 10 task scenarios.
                    </p>

                    <p className="leading-relaxed text-sm mb-8">
                        The evaluation reveals that UI effectiveness depends on alignment with task structure and user cognition. While generative UIs excel in structured domains like Academic Research and Education, traditional chat interfaces remain competitive in tasks involving strategic ambiguity or high-level reasoning.
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Demo Screenshots</h3>
                    <p className="leading-relaxed text-sm mb-5">
                        Below are examples of generative user interfaces generated by our system for different types of queries and interaction scenarios.
                    </p>

                    {/* Screenshot carousel */}
                    <div className="relative max-w-4xl mx-auto">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShotIdx(i => (i - 1 + screenshots.length) % screenshots.length)}
                            className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-10"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>

                        <div className="w-full h-96 rounded-lg overflow-hidden">
                            <img
                                src={screenshots[shotIdx].src}
                                alt={screenshots[shotIdx].caption}
                                className="w-full h-full object-contain"
                            />
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setShotIdx(i => (i + 1) % screenshots.length)}
                            className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-10"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    <p className="text-center mt-3 text-sm text-muted-foreground">
                        {screenshots[shotIdx].caption}
                    </p>

                    <h3 className="text-2xl font-semibold mb-4">Citation</h3>
                    <div className="relative rounded-lg overflow-hidden">
                        <SyntaxHighlighter
                            language="latex"
                            style={oneDark}
                            customStyle={{
                                margin: 0,
                                borderRadius: '0.5rem',
                                fontSize: '0.75rem',
                                lineHeight: '1.4',
                                paddingRight: '4rem',
                                fontFamily: 'var(--font-mono), "IBM Plex Mono", ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                fontWeight: '400'
                            }}
                        >
                            {`@article{chen2025generative,
  title={Generative Interfaces for Language Models},
  author={Chen, Jiaqi and Zhang, Yanzhe and Zhang, Yutong and Shao, Yijia and Yang, Diyi},
  journal={arXiv preprint},
  year={2025}
}`}
                        </SyntaxHighlighter>
                        <Button
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2 text-xs"
                            onClick={() => {
                                const bibtexContent = `@article{chen2025generative,
  title={{Beyond Chat}: Generative Interfaces for Language Models},
  author={Chen, Jiaqi and Zhang, Yanzhe and Zhang, Yutong and Shao, Yijia and Yang, Diyi},
  journal={arXiv preprint},
  year={2025},
  note={Jiaqi Chen and Yanzhe Zhang contributed equally}
}`;
                                navigator.clipboard.writeText(bibtexContent);
                                const btn = event?.target as HTMLButtonElement;
                                btn.textContent = 'Copied!';
                                setTimeout(() => {
                                    btn.textContent = 'Copy';
                                }, 2000);
                            }}
                        >
                            Copy
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Fullscreen Modal */}
            <FullscreenModal
                isOpen={fullscreenModal.isOpen}
                onClose={handleCloseFullscreen}
                url={fullscreenModal.url}
                title={fullscreenModal.title}
            />
        </div>
    );
} 