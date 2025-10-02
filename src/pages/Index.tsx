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
}

const CATEGORIES = ['Все', 'Популярные', 'FPS', 'RPG', 'Симуляторы', 'Утилиты'];

const SCRIPTS: Script[] = [
  {
    id: 1,
    title: 'Aimbot Pro',
    description: 'Продвинутый скрипт для точного прицеливания в любых FPS играх',
    category: 'FPS',
    downloads: 15420
  },
  {
    id: 2,
    title: 'Speed Hack Ultra',
    description: 'Ускорение передвижения персонажа с настраиваемой скоростью',
    category: 'Утилиты',
    downloads: 12890
  },
  {
    id: 3,
    title: 'Auto Farm Master',
    description: 'Автоматический фарм ресурсов для симуляторов и RPG игр',
    category: 'Симуляторы',
    downloads: 18350
  },
  {
    id: 4,
    title: 'ESP Wallhack',
    description: 'Показывает врагов через стены с индикаторами здоровья',
    category: 'FPS',
    downloads: 9870
  },
  {
    id: 5,
    title: 'Infinite Jump',
    description: 'Бесконечные прыжки для преодоления любых препятствий',
    category: 'Утилиты',
    downloads: 7650
  },
  {
    id: 6,
    title: 'God Mode Shield',
    description: 'Защита от урона и неуязвимость персонажа',
    category: 'RPG',
    downloads: 14230
  },
  {
    id: 7,
    title: 'Teleport Pro',
    description: 'Телепортация к любой точке на карте мгновенно',
    category: 'Утилиты',
    downloads: 11540
  },
  {
    id: 8,
    title: 'Auto Clicker',
    description: 'Автоматические клики для симуляторов и кликеров',
    category: 'Симуляторы',
    downloads: 16780
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [searchQuery, setSearchQuery] = useState('');

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
    </div>
  );
};

export default Index;
