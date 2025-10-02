import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const CombosTab = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-card border-2 border-orange-500 p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-400 text-lg">
            <Icon name="Flame" size={24} />
            Player 1 Комбо
          </h3>
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg border border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-orange-400">🔥 Огненный Удар</span>
                <span className="text-xs text-gray-400">25 урона</span>
              </div>
              <div className="flex gap-2 items-center">
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">A</kbd>
                <span className="text-gray-400">+</span>
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-lg border border-yellow-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-yellow-400">💥 Жёсткий Удар</span>
                <span className="text-xs text-gray-400">35 урона</span>
              </div>
              <div className="flex gap-2 items-center">
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
                <span className="text-gray-400">+</span>
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-lg border-2 border-purple-500 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-400">💀 ФАТАЛИТИ</span>
                <span className="text-xs text-red-400 font-bold">100 урона!</span>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">A</kbd>
                <span className="text-gray-400">+</span>
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
                <span className="text-gray-400">+</span>
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">F</kbd>
                <span className="text-gray-400">+</span>
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">Q</kbd>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-card border-2 border-red-500 p-4">
          <h3 className="font-bold mb-4 flex items-center gap-2 text-red-400 text-lg">
            <Icon name="Flame" size={24} />
            Player 2 Комбо
          </h3>
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-lg border border-orange-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-orange-400">🔥 Огненный Удар</span>
                <span className="text-xs text-gray-400">25 урона</span>
              </div>
              <div className="flex gap-2 items-center">
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">←</kbd>
                <span className="text-gray-400">+</span>
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">SHIFT</kbd>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-lg border border-yellow-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-yellow-400">💥 Жёсткий Удар</span>
                <span className="text-xs text-gray-400">35 урона</span>
              </div>
              <div className="flex gap-2 items-center">
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">SHIFT</kbd>
                <span className="text-gray-400">+</span>
                <kbd className="px-3 py-1 bg-background rounded font-mono text-sm">SHIFT</kbd>
              </div>
            </div>
            
            <div className="bg-muted p-3 rounded-lg border-2 border-purple-500 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-purple-400">💀 ФАТАЛИТИ</span>
                <span className="text-xs text-red-400 font-bold">100 урона!</span>
              </div>
              <div className="flex gap-2 items-center flex-wrap">
                <kbd className="px-2 py-1 bg-background rounded font-mono text-xs">←</kbd>
                <span className="text-gray-400 text-xs">+</span>
                <kbd className="px-2 py-1 bg-background rounded font-mono text-xs">SHIFT</kbd>
                <span className="text-gray-400 text-xs">+</span>
                <kbd className="px-2 py-1 bg-background rounded font-mono text-xs">SHIFT</kbd>
                <span className="text-gray-400 text-xs">+</span>
                <kbd className="px-2 py-1 bg-background rounded font-mono text-xs">ENTER</kbd>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="bg-muted/50 border border-primary/30 p-4">
        <div className="flex gap-3">
          <Icon name="Info" className="text-primary flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm text-gray-300">
            <p className="font-bold mb-1">Как использовать комбо:</p>
            <p>Быстро нажимайте клавиши одну за другой. Между нажатиями должно пройти менее 1.2 секунды. Комбо активируется автоматически при правильной последовательности!</p>
          </div>
        </div>
      </Card>
      
      <Card className="bg-purple-950/30 border-2 border-purple-500 p-4">
        <div className="flex gap-3">
          <Icon name="Skull" className="text-purple-400 flex-shrink-0 mt-0.5" size={24} />
          <div className="text-sm text-gray-300">
            <p className="font-bold mb-1 text-purple-400 text-lg">⚠️ ФАТАЛИТИ - Финишный Удар!</p>
            <p>Мгновенно наносит 100 урона - гарантированная победа! Используйте, когда противник близко. Это самая мощная атака в игре с невероятными визуальными эффектами!</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CombosTab;
