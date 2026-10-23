
import { Settings } from 'lucide-react';
import ModulePage from './ModulePage';

export default function SettingsPage() {
  return (
    <ModulePage
      eyebrow="ADMINISTRAÇÃO"
      title="Configurações"
      description="Organize as preferências e prepare a estrutura de administração do espaço de trabalho."
      icon={<Settings size={25} />}
      features={[
        'Preferências gerais da aplicação',
        'Estrutura futura de usuários e permissões',
        'Configurações de integrações',
      ]}
    />
  );
}
