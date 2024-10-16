import React, { useState } from 'react';

interface ModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

interface Document {
  id: number;
  name: string;
  date: string;
  observation: string;
}

const Modal: React.FC<ModalProps> = ({ isModalOpen, closeModal }) => {
  // Sample documents data
  const documents: Document[] = [
    { id: 1, name: 'Ejemplar', date: '12/10/2024', observation: 'Observacion1' },
    { id: 2, name: 'Resolución de asignación', date: '12/10/2024', observation: 'Observacion2' },
  ];

  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [documentObservation, setDocumentObservation] = useState<File | null>(null);

  if (!isModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDocumentObservation(e.target.files[0]);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocuments((prevSelected) => {
      // If the document is already selected, deselect it
      if (prevSelected.some((doc) => doc.id === document.id)) {
        return prevSelected.filter((doc) => doc.id !== document.id);
      }
      // Otherwise, add it to the selected documents
      return [...prevSelected, document];
    });
  };

  const handleObservationChange = (id: number, observation: string) => {
    setSelectedDocuments((prevSelected) =>
      prevSelected.map((doc) =>
        doc.id === id ? { ...doc, observation } : doc
      )
    );
  };

  const handleViewPdf = () => {
    const pdfWindow = window.open('', '_blank');
    if (pdfWindow) {
      pdfWindow.document.write(`
        <html>
          <head><title>PDF Documento</title></head>
          <body>
            <h1>Documento PDF vacío</h1>
            <p>Aquí puedes mostrar el contenido de tu PDF.</p>
          </body>
        </html>
      `);
      pdfWindow.document.close();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
      onClick={handleOutsideClick}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold mb-6">Document Review</h3>

        {/* Table Structure */}
        <table className="min-w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border">Documento</th>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Envío</th> {/* Nueva columna con el ojito */}
              <th className="px-4 py-2 border">Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id}>
                <td className="px-4 py-2 border">{document.name}</td>
                <td className="px-4 py-2 border">{document.date}</td>
                <td className="px-4 py-2 border text-center">
                  {/* Botón con el icono de ojito para abrir PDF */}
                  <button onClick={handleViewPdf}>
                    👁️
                  </button>
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    className={`px-2 py-1 rounded ${selectedDocuments.some(
                      (doc) => doc.id === document.id
                    ) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
                    onClick={() => handleDocumentSelect(document)}
                  >
                    {selectedDocuments.some((doc) => doc.id === document.id)
                      ? 'Deselect'
                      : 'Seleccionar'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Dynamic Observation Fields */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Observaciones:
          </label>
          {selectedDocuments.length > 0 ? (
            selectedDocuments.map((document) => (
              <div key={document.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Observación para {document.name}:
                </label>
                <textarea
                  className="mt-1 block w-full p-2 border rounded-md"
                  rows={3}
                  value={document.observation}
                  onChange={(e) =>
                    handleObservationChange(document.id, e.target.value)
                  }
                />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay documentos seleccionados.</p>
          )}
        </div>

        {/* Document Upload Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Documento Observado:
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-700 border rounded-md"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded"
            onClick={closeModal}
          >
            Observar
          </button>

          <div className="flex space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Cancelar
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Aprobar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
