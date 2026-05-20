import { useState } from 'react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Card } from '../common/Card';

interface ContextAccordionProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
}

const ContextAccordion = ({ title, content, defaultOpen = false }: ContextAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-700 text-left font-semibold text-white transition-colors flex justify-between items-center"
      >
        {title}
        <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {isOpen && <div className="px-4 py-3 bg-gray-900 border-t border-gray-700 text-gray-300">{content}</div>}
    </div>
  );
};

interface BlueprintViewerProps {
  markdown: string;
  contextSegments?: Array<{ title: string; content: string }>;
  isLoading?: boolean;
}

export const BlueprintViewer = ({ markdown, contextSegments = [], isLoading = false }: BlueprintViewerProps) => {
  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Health Optimization Blueprint</h2>
        <p className="text-gray-400">AI-generated personalized health recommendations based on your biomarkers</p>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-4 text-gray-400">Generating blueprint...</span>
        </div>
      )}

      {markdown && (
        <div className="space-y-6">
          <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
            <MarkdownRenderer content={markdown} />
          </div>

          {contextSegments.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Research Context</h3>
              {contextSegments.map((segment, idx) => (
                <ContextAccordion
                  key={idx}
                  title={segment.title}
                  content={segment.content}
                  defaultOpen={idx === 0}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!markdown && !isLoading && (
        <div className="text-center py-12 text-gray-400">
          No blueprint generated yet. Log your biomarker values and click "Generate Blueprint" to get started.
        </div>
      )}
    </Card>
  );
};
