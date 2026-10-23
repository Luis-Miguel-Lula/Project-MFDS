
import { Bot } from 'lucide-react';
import ModulePage from './ModulePage';

export default function AutomationsPage() {
  return (
    <ModulePage
      eyebrow="PRODUTIVIDADE"
      title="Automações"
      description="Prepare fluxos para reduzir tarefas repetitivas e conectar etapas do trabalho."
      icon={<Bot size={25} />}
      features={[
        'Catálogo de automações',
        'Definição de gatilhos e ações',
        'Histórico e acompanhamento de execuções',
      ]}
      nextPath="/configuracoes"
      nextLabel="Conhecer as configurações"
    />
  );
}
