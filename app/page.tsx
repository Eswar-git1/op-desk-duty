import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Medal, FileText, Coffee, Brain } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Operation Desk Duty</h1>
          <p className="text-xl text-gray-300">
            Navigate the hilarious world of military bureaucracy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="p-6 bg-gray-800 border-gray-700">
            <Medal className="w-12 h-12 mb-4 text-yellow-500" />
            <h3 className="text-xl font-semibold mb-2">Earn Medals</h3>
            <p className="text-gray-400">
              Rise through the ranks with your administrative prowess
            </p>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <FileText className="w-12 h-12 mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Master Paperwork</h3>
            <p className="text-gray-400">
              Navigate through endless forms and reports
            </p>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <Coffee className="w-12 h-12 mb-4 text-brown-500" />
            <h3 className="text-xl font-semibold mb-2">Manage Chai Levels</h3>
            <p className="text-gray-400">
              Keep your energy up with perfectly timed chai breaks
            </p>
          </Card>

          <Card className="p-6 bg-gray-800 border-gray-700">
            <Brain className="w-12 h-12 mb-4 text-purple-500" />
            <h3 className="text-xl font-semibold mb-2">Preserve Sanity</h3>
            <p className="text-gray-400">
              Balance your mental health amidst bureaucratic chaos
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Link href="/game">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-8 py-4 text-lg"
            >
              Start Your Duty
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}