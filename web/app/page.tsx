import SearchEngineUI from '@/components/SearchEngineUI';
import { prisma } from '@/lib/prisma';

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function HomePage() {
  const settingsRecords = await prisma.setting.findMany();
  const settings = settingsRecords.reduce((acc: any, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-main)', display: 'flex', flexDirection: 'column' }}>
      <SearchEngineUI 
        projectName={settings.projectName || 'FocusEngine'} 
        companyLogo={settings.companyLogo || ''}
        pinnedWebsites={settings.pinnedWebsites ? settings.pinnedWebsites.split(',').map((s: string) => {
          const trimmed = s.trim();
          const parts = trimmed.split('|');
          if (parts.length === 2) return { label: parts[0].trim(), url: parts[1].trim() };
          return { label: '', url: trimmed };
        }).filter((p: { url: string }) => p.url) : []}
      />
    </main>
  );
}
