import { generarSilaboPDF } from '../utils/pdfUtils';

interface SilaboProps {
  silabo: any; // Ajusta este tipo según tu estructura de datos
}

const GenerateSilaboPDF: React.FC<SilaboProps> = ({ silabo }) => {
  const handleGeneratePDF = () => {
    generarSilaboPDF(silabo, 2);
  };

  return (
    <div>
      <button onClick={handleGeneratePDF}>Descargar Sílabo en PDF</button>
    </div>
  );
};

export default GenerateSilaboPDF;
