import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { Toaster } from './ui/toaster';
import { 
  Home, 
  Heart, 
  PiggyBank, 
  Plus, 
  RotateCcw, 
  DollarSign,
  TrendingUp,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';

const Plan502030 = () => {
  const [planData, setPlanData] = useState(null);
  const [isSetup, setIsSetup] = useState(false);
  const [initialCapital, setInitialCapital] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const { toast } = useToast();

  // Cargar datos desde localStorage al inicializar
  useEffect(() => {
    const savedData = localStorage.getItem('plan502030');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setPlanData(parsedData);
      setIsSetup(true);
    }
  }, []);

  // Guardar datos en localStorage
  const saveToLocalStorage = (data) => {
    localStorage.setItem('plan502030', JSON.stringify(data));
  };

  // Configurar plan inicial
  const setupPlan = () => {
    const capital = parseFloat(initialCapital);
    if (!capital || capital <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un capital inicial válido",
        variant: "destructive",
      });
      return;
    }

    const newPlan = {
      capitalInicial: capital,
      bloques: {
        necesidades: capital * 0.5,
        deseos: capital * 0.3,
        ahorro: capital * 0.2
      },
      transacciones: []
    };

    setPlanData(newPlan);
    saveToLocalStorage(newPlan);
    setIsSetup(true);
    setInitialCapital('');
    
    toast({
      title: "¡Plan creado!",
      description: "Tu plan 50-30-20 está listo para usar",
    });
  };

  // Calcular gastos totales por categoría
  const calculateTotalSpent = (category) => {
    if (!planData) return 0;
    return planData.transacciones
      .filter(t => t.categoria === category)
      .reduce((total, t) => total + t.monto, 0);
  };

  // Calcular saldo disponible por categoría
  const calculateAvailableBalance = (category) => {
    if (!planData) return 0;
    const totalSpent = calculateTotalSpent(category);
    return planData.bloques[category] - totalSpent;
  };

  // Añadir gasto
  const addExpense = () => {
    if (!expenseAmount || !expenseCategory) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(expenseAmount);
    if (amount <= 0) {
      toast({
        title: "Error",
        description: "El monto debe ser mayor a 0",
        variant: "destructive",
      });
      return;
    }

    const availableBalance = calculateAvailableBalance(expenseCategory);
    if (amount > availableBalance) {
      toast({
        title: "Saldo insuficiente",
        description: `No puedes gastar más de $${availableBalance.toFixed(2)} en ${expenseCategory}`,
        variant: "destructive",
      });
      return;
    }

    const newTransaction = {
      fecha: new Date().toISOString().slice(0, 10),
      categoria: expenseCategory,
      monto: amount
    };

    const updatedPlan = {
      ...planData,
      transacciones: [...planData.transacciones, newTransaction]
    };

    setPlanData(updatedPlan);
    saveToLocalStorage(updatedPlan);
    setExpenseAmount('');
    setExpenseCategory('');

    toast({
      title: "Gasto agregado",
      description: `$${amount.toFixed(2)} agregado a ${expenseCategory}`,
    });
  };

  // Reiniciar plan
  const resetPlan = () => {
    localStorage.removeItem('plan502030');
    setPlanData(null);
    setIsSetup(false);
    setInitialCapital('');
    setExpenseAmount('');
    setExpenseCategory('');
    
    toast({
      title: "Plan reiniciado",
      description: "Todos los datos han sido eliminados",
    });
  };

  // Configuración de categorías
  const categories = [
    {
      key: 'necesidades',
      title: 'Necesidades (50%)',
      icon: Home,
      color: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
      iconColor: 'text-green-600',
      description: 'Gastos fijos: alquiler, comida, servicios básicos'
    },
    {
      key: 'deseos',
      title: 'Deseos (30%)',
      icon: Heart,
      color: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
      iconColor: 'text-blue-600',
      description: 'Entretenimiento, compras, restaurantes'
    },
    {
      key: 'ahorro',
      title: 'Ahorro (20%)',
      icon: PiggyBank,
      color: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200',
      iconColor: 'text-yellow-600',
      description: 'Fondo de emergencia, inversiones, futuro'
    }
  ];

  if (!isSetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Plan 50-30-20</h1>
            <p className="text-gray-600">Administra tu dinero de manera inteligente</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl text-gray-800">
                Configura tu Capital Inicial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="capital" className="text-sm font-medium text-gray-700">
                  Capital Inicial ($)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="capital"
                    type="number"
                    value={initialCapital}
                    onChange={(e) => setInitialCapital(e.target.value)}
                    placeholder="Ingresa tu capital inicial"
                    className="pl-10 h-12 text-lg"
                  />
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-gray-800">La regla 50-30-20:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 50% para necesidades básicas</li>
                  <li>• 30% para deseos personales</li>
                  <li>• 20% para ahorro e inversiones</li>
                </ul>
              </div>

              <Button 
                onClick={setupPlan}
                className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Crear Mi Plan
              </Button>
            </CardContent>
          </Card>
        </div>
        <Toaster />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Plan 50-30-20</h1>
          <p className="text-gray-600">Capital inicial: ${planData?.capitalInicial?.toFixed(2)}</p>
        </div>

        {/* Tarjetas de categorías */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            const totalBudget = planData?.bloques[category.key] || 0;
            const totalSpent = calculateTotalSpent(category.key);
            const availableBalance = calculateAvailableBalance(category.key);
            const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

            return (
              <Card key={category.key} className={`${category.color} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-gray-800">
                      {category.title}
                    </CardTitle>
                    <IconComponent className={`h-6 w-6 ${category.iconColor}`} />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{category.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Disponible</span>
                      <span className="font-bold text-lg text-gray-800">
                        ${availableBalance.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>Gastado: ${totalSpent.toFixed(2)}</span>
                      <span>Total: ${totalBudget.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        percentage >= 100 ? 'bg-red-500' : 
                        percentage >= 80 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  
                  {percentage >= 100 && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      <span>Presupuesto agotado</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Formulario para añadir gastos */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Añadir Gasto</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="necesidades">Necesidades</SelectItem>
                    <SelectItem value="deseos">Deseos</SelectItem>
                    <SelectItem value="ahorro">Ahorro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Monto ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="amount"
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="invisible">Acción</Label>
                <Button 
                  onClick={addExpense}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Añadir Gasto
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transacciones recientes */}
        {planData?.transacciones?.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle>Transacciones Recientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {planData.transacciones.slice(-10).reverse().map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        transaction.categoria === 'necesidades' ? 'bg-green-100' :
                        transaction.categoria === 'deseos' ? 'bg-blue-100' :
                        'bg-yellow-100'
                      }`}>
                        {transaction.categoria === 'necesidades' && <Home className="h-4 w-4 text-green-600" />}
                        {transaction.categoria === 'deseos' && <Heart className="h-4 w-4 text-blue-600" />}
                        {transaction.categoria === 'ahorro' && <PiggyBank className="h-4 w-4 text-yellow-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{transaction.categoria}</p>
                        <p className="text-sm text-gray-500">{transaction.fecha}</p>
                      </div>
                    </div>
                    <span className="font-bold text-lg text-gray-800">
                      -${transaction.monto.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botón de reiniciar */}
        <div className="text-center">
          <Button 
            onClick={resetPlan}
            variant="outline"
            className="bg-white/50 hover:bg-red-50 text-red-600 border-red-200 hover:border-red-300 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reiniciar Plan
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default Plan502030;