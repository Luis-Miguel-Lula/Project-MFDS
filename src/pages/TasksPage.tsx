
import { CheckSquare } from 'lucide-react';
import ModulePage from './ModulePage';

export default function TasksPage() {
  return (
    <ModulePage
      eyebrow="EXECUÇÃO"
      title="Tarefas"
      description="Visualize atividades, organize prioridades e acompanhe o andamento do trabalho."
      icon={<CheckSquare size={25} />}
      features={[
        'Lista de atividades e responsáveis',
        'Prioridades, prazos e estados',
        'Organização de tarefas por projeto',
      ]}
      nextPath="/ideias"
      nextLabel="Conhecer o módulo de ideias"
    />
  );
}
