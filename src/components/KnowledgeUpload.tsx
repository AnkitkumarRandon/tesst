import { Upload, FileText, Check, Loader2 } from 'lucide-react';

interface KnowledgeUploadProps {
  uploadedFile: {
    name: string;
    status: 'processing' | 'indexed' | 'ready';
    progress: number;
  } | null;
  onFileUpload: (file: File) => void;
}

export function KnowledgeUpload({ uploadedFile, onFileUpload }: KnowledgeUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'indexed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'ready': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'indexed': return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'ready': return <Check className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 shadow-xl">
      <div className="flex items-center space-x-2 mb-6">
        <FileText className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-semibold text-white">Upload FAQ & Service Documents</h2>
      </div>

      <div className="space-y-4">
        {!uploadedFile ? (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-cyan-500 transition-colors">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <label className="cursor-pointer">
              <span className="inline-block px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg transition-colors">
                Upload PDF
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <p className="text-sm text-gray-400 mt-4">
              Select a PDF file containing your FAQ and service information
            </p>
          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-800 rounded-lg">
                  <FileText className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-sm text-gray-400">PDF Document</p>
                </div>
              </div>
              <span className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(uploadedFile.status)}`}>
                {getStatusIcon(uploadedFile.status)}
                <span className="capitalize">{uploadedFile.status}</span>
              </span>
            </div>

            {uploadedFile.status !== 'ready' && (
              <div className="space-y-2">
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${uploadedFile.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  {uploadedFile.status === 'processing' ? 'Processing document...' : 'Indexing content...'}
                </p>
              </div>
            )}

            {uploadedFile.status === 'ready' && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-400 font-medium">
                  Document successfully indexed and ready to use!
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-4 p-4 bg-gray-900 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-400">
            The AI agent will answer calls strictly based on the information in this document.
          </p>
        </div>
      </div>
    </div>
  );
}
