
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { EscalationForm } from '@/components/complaint/EscalationForm';

const EscalationFormPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <EscalationForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EscalationFormPage;
