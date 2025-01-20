import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Medal, FileText, Coffee, Brain } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleStartDuty = () => {
    // Direct navigation to Game
    navigate('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-800">
            Operation Desk Duty
          </h1>
          <p className="text-xl text-gray-600">
            Navigate the hilarious world of military bureaucracy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="p-6 bg-white border-2 border-yellow-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-yellow-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Medal className="w-12 h-12 text-yellow-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Earn Medals
            </h3>
            <p className="text-gray-600">
              Rise through the ranks with your administrative prowess
            </p>
          </Card>

          <Card className="p-6 bg-white border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-blue-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Master Paperwork
            </h3>
            <p className="text-gray-600">
              Navigate through endless forms and reports
            </p>
          </Card>

          <Card className="p-6 bg-white border-2 border-amber-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-amber-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Coffee className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Manage Chai Levels
            </h3>
            <p className="text-gray-600">
              Keep your energy up with perfectly timed chai breaks
            </p>
          </Card>

          <Card className="p-6 bg-white border-2 border-purple-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="bg-purple-50 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Brain className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Preserve Sanity
            </h3>
            <p className="text-gray-600">
              Balance your mental health amidst bureaucratic chaos
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            onClick={handleStartDuty}
          >
            Start Your Duty
          </Button>
        </div>
      </div>
    </div>
  );
}
