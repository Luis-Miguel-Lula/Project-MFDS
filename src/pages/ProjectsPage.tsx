
import { FolderKanban } from 'lucide-react';
import ModulePage from './ModulePage';

export default function ProjectsPage() {
  return (
    <ModulePage
      eyebrow="GESTÃO DO TRABALHO"
      title="Projetos"
      description="Organize iniciativas, acompanhe entregas e mantenha os objetivos do seu time em um só lugar."
      icon={<FolderKanban size={25} />}
      features={[
        'Listagem e organização de projetos',
        'Detalhes, objetivos e responsáveis',
        'Acompanhamento do progresso e das entregas',
      ]}
      nextPath="/tarefas"
      nextLabel="Conhecer o módulo de tarefas"
    />
  );
}
