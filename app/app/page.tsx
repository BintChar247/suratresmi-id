import { WizardContainer } from '@/components/Wizard/WizardContainer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Buat Surat — SuratResmi.Online',
  description: 'Buat surat resmi dalam 30 detik dengan bantuan AI.',
};

export default function WizardPage(): JSX.Element {
  return <WizardContainer />;
}
