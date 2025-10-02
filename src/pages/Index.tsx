import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GameCanvas from '@/components/game/GameCanvas';
import HealthBar from '@/components/game/HealthBar';
import ControlsTab from '@/components/game/ControlsTab';
import CombosTab from '@/components/game/CombosTab';
import { useGameLogic } from '@/components/game/useGameLogic';

const Index = () => {
  const { fighter1, fighter2, particles, gameStarted, winner, startGame } = useGameLogic();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F2937] via-[#1a1f2e] to-[#111827] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <h1 className="text-6xl font-black text-center mb-8 gradient-purple-pink bg-clip-text text-transparent">
          PORTAL COMBAT
        </h1>

        <Card className="bg-card border-2 border-primary p-6 mb-4">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <HealthBar fighter={fighter1} />
            <HealthBar fighter={fighter2} />
          </div>

          <GameCanvas
            fighter1={fighter1}
            fighter2={fighter2}
            particles={particles}
            gameStarted={gameStarted}
            winner={winner}
            onStartGame={startGame}
          />
        </Card>

        <Tabs defaultValue="controls" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="controls">Управление</TabsTrigger>
            <TabsTrigger value="combos">Комбо Удары</TabsTrigger>
          </TabsList>
          
          <TabsContent value="controls" className="space-y-4">
            <ControlsTab fighter1={fighter1} fighter2={fighter2} />
          </TabsContent>

          <TabsContent value="combos" className="space-y-4">
            <CombosTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
