
import { Lightbulb } from 'lucide-react';
import ModulePage from './ModulePage';

export default function IdeasPage() {
  return (
    <ModulePage
      eyebrow="CRIATIVIDADE"
      title="Ideias"
      description="Reúna propostas, organize oportunidades e prepare ideias para avaliação."
      icon={<Lightbulb size={25} />}
      features={[
        'Registro e organização de ideias',
        'Classificação e priorização de propostas',
        'Evolução de ideias para iniciativas',
      ]}
      nextPath="/automacoes"
      nextLabel="Conhecer o módulo de automações"
    />
  );
}
