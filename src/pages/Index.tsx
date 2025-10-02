import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Script {
  id: number;
  title: string;
  description: string;
  category: string;
  downloads: number;
  code: string;
}

const CATEGORIES = ['Все', 'Популярные', 'FPS', 'RPG', 'Симуляторы', 'Утилиты'];

const SCRIPTS: Script[] = [
  {
    id: 1,
    title: 'Aimbot Pro',
    description: 'Продвинутый скрипт для точного прицеливания в любых FPS играх',
    category: 'FPS',
    downloads: 15420,
    code: `-- Aimbot Pro Script for Delta
local player = game.Players.LocalPlayer
local camera = workspace.CurrentCamera

function getClosestEnemy()
    local closest, distance = nil, math.huge
    for _, v in pairs(game.Players:GetPlayers()) do
        if v ~= player and v.Character and v.Character:FindFirstChild("Head") then
            local magnitude = (v.Character.Head.Position - player.Character.Head.Position).magnitude
            if magnitude < distance then
                closest, distance = v, magnitude
            end
        end
    end
    return closest
end

game:GetService("RunService").RenderStepped:Connect(function()
    local target = getClosestEnemy()
    if target and target.Character then
        camera.CFrame = CFrame.new(camera.CFrame.Position, target.Character.Head.Position)
    end
end)`
  },
  {
    id: 2,
    title: 'Speed Hack Ultra',
    description: 'Ускорение передвижения персонажа с настраиваемой скоростью',
    category: 'Утилиты',
    downloads: 12890,
    code: `-- Speed Hack Ultra for Delta
local speed = 100 -- Измените скорость здесь
local player = game.Players.LocalPlayer

player.Character.Humanoid.WalkSpeed = speed

player.Character.Humanoid:GetPropertyChangedSignal("WalkSpeed"):Connect(function()
    player.Character.Humanoid.WalkSpeed = speed
end)`
  },
  {
    id: 3,
    title: 'Auto Farm Master',
    description: 'Автоматический фарм ресурсов для симуляторов и RPG игр',
    category: 'Симуляторы',
    downloads: 18350,
    code: `-- Auto Farm Master for Delta
local player = game.Players.LocalPlayer
local farming = true

while farming do
    for _, item in pairs(workspace:GetDescendants()) do
        if item:IsA("Part") and item.Name == "Coin" then
            player.Character.HumanoidRootPart.CFrame = item.CFrame
            wait(0.1)
        end
    end
    wait(1)
end`
  },
  {
    id: 4,
    title: 'ESP Wallhack',
    description: 'Показывает врагов через стены с индикаторами здоровья',
    category: 'FPS',
    downloads: 9870,
    code: `-- ESP Wallhack for Delta
local player = game.Players.LocalPlayer

for _, v in pairs(game.Players:GetPlayers()) do
    if v ~= player then
        local highlight = Instance.new("Highlight")
        highlight.Parent = v.Character
        highlight.FillColor = Color3.fromRGB(255, 0, 0)
        highlight.OutlineColor = Color3.fromRGB(255, 255, 255)
    end
end`
  },
  {
    id: 5,
    title: 'Infinite Jump',
    description: 'Бесконечные прыжки для преодоления любых препятствий',
    category: 'Утилиты',
    downloads: 7650,
    code: `-- Infinite Jump for Delta
local player = game.Players.LocalPlayer
local mouse = player:GetMouse()

mouse.KeyDown:Connect(function(key)
    if key == " " then
        player.Character.Humanoid:ChangeState(3)
    end
end)`
  },
  {
    id: 6,
    title: 'God Mode Shield',
    description: 'Защита от урона и неуязвимость персонажа',
    category: 'RPG',
    downloads: 14230,
    code: `-- God Mode Shield for Delta
local player = game.Players.LocalPlayer

player.Character.Humanoid.MaxHealth = math.huge
player.Character.Humanoid.Health = math.huge

player.Character.Humanoid:GetPropertyChangedSignal("Health"):Connect(function()
    player.Character.Humanoid.Health = math.huge
end)`
  },
  {
    id: 7,
    title: 'Teleport Pro',
    description: 'Телепортация к любой точке на карте мгновенно',
    category: 'Утилиты',
    downloads: 11540,
    code: `-- Teleport Pro for Delta
local player = game.Players.LocalPlayer
local mouse = player:GetMouse()

mouse.KeyDown:Connect(function(key)
    if key == "t" then
        player.Character.HumanoidRootPart.CFrame = CFrame.new(mouse.Hit.Position)
    end
end)

print("Press 'T' to teleport to mouse position")`
  },
  {
    id: 8,
    title: 'Auto Clicker',
    description: 'Автоматические клики для симуляторов и кликеров',
    category: 'Симуляторы',
    downloads: 16780,
    code: `-- Auto Clicker for Delta
local clicking = true

while clicking do
    mouse1click()
    wait(0.01) -- Задержка между кликами
end`
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredScripts = SCRIPTS.filter(script => {
    const matchesCategory = selectedCategory === 'Все' || script.category === selectedCategory;
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          script.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1F2937] via-[#1a1f2e] to-[#111827]">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-12 text-center">
          <h1 className="text-6xl font-black mb-4 gradient-purple-pink bg-clip-text text-transparent">
            DELTA SCRIPTS
          </h1>
          <p className="text-xl text-gray-300">Топовые скрипты для Roblox Delta Executor</p>
        </header>

        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto mb-6">
            <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Поиск скриптов..."
              className="pl-12 h-14 bg-card border-2 border-border text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`font-semibold px-6 py-2 ${
                  selectedCategory === category 
                    ? 'gradient-purple-pink border-0' 
                    : 'border-2 border-primary/50 hover:border-primary bg-card/50'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredScripts.map(script => (
            <Card 
              key={script.id} 
              className="bg-card border-2 border-border hover:border-primary transition-all duration-300 hover-scale overflow-hidden group"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Icon name="Code" className="text-primary" size={28} />
                  <Badge variant="secondary" className="gradient-purple-pink border-0">
                    {script.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl mb-2">{script.title}</CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  {script.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Icon name="Download" size={16} />
                    <span>{script.downloads.toLocaleString()}</span>
                  </div>
                  <Button 
                    className="gradient-purple-pink font-bold border-0 hover:opacity-90"
                    size="sm"
                    onClick={() => setSelectedScript(script)}
                  >
                    Скачать
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredScripts.length === 0 && (
          <div className="text-center py-20">
            <Icon name="SearchX" className="mx-auto mb-4 text-gray-500" size={64} />
            <p className="text-2xl text-gray-400">Скрипты не найдены</p>
            <p className="text-gray-500 mt-2">Попробуйте изменить фильтры или поисковый запрос</p>
          </div>
        )}
      </div>

      {selectedScript && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedScript(null)}>
          <Card className="bg-card border-2 border-primary max-w-3xl w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="Code" className="text-primary" size={32} />
                    <Badge variant="secondary" className="gradient-purple-pink border-0">
                      {selectedScript.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl mb-2">{selectedScript.title}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {selectedScript.description}
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setSelectedScript(null)}
                  className="ml-4"
                >
                  <Icon name="X" size={24} />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Icon name="Download" size={20} />
                    <span>{selectedScript.downloads.toLocaleString()} загрузок</span>
                  </div>
                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(selectedScript.code);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="gradient-purple-pink border-0"
                  >
                    <Icon name={copied ? "Check" : "Copy"} size={16} className="mr-2" />
                    {copied ? 'Скопировано!' : 'Копировать код'}
                  </Button>
                </div>

                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                    <Icon name="FileCode" size={20} className="text-primary" />
                    Код скрипта
                  </h3>
                  <pre className="text-sm overflow-x-auto p-4 bg-background rounded border border-border">
                    <code className="text-gray-300">{selectedScript.code}</code>
                  </pre>
                </div>

                <div className="bg-muted p-4 rounded-lg border border-border">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Icon name="Info" size={20} className="text-primary" />
                    Инструкция по установке
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-300">
                    <li className="flex gap-2">
                      <span className="font-bold gradient-purple-pink bg-clip-text text-transparent">1.</span>
                      <span>Запустите Delta Executor</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold gradient-purple-pink bg-clip-text text-transparent">2.</span>
                      <span>Нажмите кнопку "Копировать код" выше</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold gradient-purple-pink bg-clip-text text-transparent">3.</span>
                      <span>Вставьте код в окно Delta (Ctrl+V)</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold gradient-purple-pink bg-clip-text text-transparent">4.</span>
                      <span>Зайдите в игру Roblox</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold gradient-purple-pink bg-clip-text text-transparent">5.</span>
                      <span>Нажмите "Execute" в Delta</span>
                    </li>
                  </ol>
                </div>

                <div className="bg-destructive/10 border border-destructive/30 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <Icon name="AlertTriangle" size={20} className="text-destructive flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-bold text-destructive mb-1">Предупреждение</p>
                      <p className="text-gray-300">Использование скриптов может привести к бану аккаунта. Используйте на свой риск!</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;