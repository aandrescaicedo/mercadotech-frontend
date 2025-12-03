/**
 * LandingPage.jsx - Página de Aterrizaje (Ventas)
 * 
 * Propósito:
 * Página principal de marketing diseñada para convertir visitantes en usuarios.
 * Presenta la plataforma "MercadoTech" con un diseño premium, moderno y animado.
 * 
 * Características Principales:
 * - Diseño "Dark Mode" con gradientes violetas/índigo
 * - Animaciones fluidas usando `framer-motion` (entradas, hover, scroll reveal)
 * - Visualización 3D simulada del dashboard para mostrar potencia
 * - Navegación simplificada (sin la navbar de la app) para enfocar en CTA
 * 
 * Secciones:
 * 1. Navbar Transparente: Logo y accesos rápidos (Login/Register)
 * 2. Hero Section: Propuesta de valor principal y CTAs
 * 3. 3D Composition: Representación visual de la plataforma
 * 4. Features Grid: Beneficios clave con efectos glassmorphism
 * 5. CTA Final: Último empuje para el registro
 * 
 * Dependencias:
 * - framer-motion: Para todas las animaciones
 * - lucide-react: Iconografía moderna
 * - react-router-dom: Navegación
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, TrendingUp, ShieldCheck, Zap, Globe, Smartphone, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#0f0c29] text-white overflow-hidden font-sans selection:bg-violet-500 selection:text-white">
            {/* 
        Background Gradients 
        Efectos de fondo difuminados para crear atmósfera
      */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] left-[30%] w-[30%] h-[30%] bg-violet-800/20 rounded-full blur-[100px]" />
            </div>

            {/* 
        Navbar Overlay 
        Navegación específica para la Landing (diferente a la de la App)
      */}
            <nav className="relative z-50 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2"
                >
                    <div className="w-8 h-8 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center">
                        <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        MercadoTech
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-6"
                >
                    <Link to="/login" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                        Iniciar Sesión
                    </Link>
                    <Link
                        to="/register"
                        className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md rounded-full text-sm font-medium transition-all hover:scale-105"
                    >
                        Registrarse
                    </Link>
                </motion.div>
            </nav>

            {/* 
        Hero Section 
        Área principal de impacto
      */}
            <section className="relative z-10 pt-20 pb-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-xs font-semibold mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                            </span>
                            La plataforma #1 para vendedores
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6">
                            El Futuro del <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400">
                                E-commerce
                            </span>
                        </h1>

                        <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                            Gestiona tu tienda, controla tus pedidos y escala tu negocio con la plataforma más avanzada y elegante del mercado.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/register"
                                className="group relative px-8 py-4 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full font-bold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:-translate-y-1 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Comenzar Ahora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Link>

                            <Link
                                to="/catalog"
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-semibold text-white backdrop-blur-sm transition-all"
                            >
                                Explorar Catálogo
                            </Link>
                        </div>
                    </motion.div>

                    {/* 
            3D Visual Composition 
            Dashboard simulado con elementos flotantes animados
          */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative h-[500px] w-full hidden lg:block"
                    >
                        {/* Main Dashboard Card */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                            className="absolute top-10 left-10 right-10 bottom-10 bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 z-20"
                        >
                            {/* Mockup Header */}
                            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                </div>
                                <div className="h-2 w-20 bg-white/10 rounded-full" />
                            </div>

                            {/* Mockup Content */}
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-gray-400 text-xs mb-1">Ventas Totales</div>
                                    <div className="text-2xl font-bold text-white">$12.4M</div>
                                    <div className="text-green-400 text-xs mt-1 flex items-center gap-1"><TrendingUp size={12} /> +12%</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-gray-400 text-xs mb-1">Pedidos</div>
                                    <div className="text-2xl font-bold text-white">1,240</div>
                                    <div className="text-violet-400 text-xs mt-1">+5%</div>
                                </div>
                                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <div className="text-gray-400 text-xs mb-1">Clientes</div>
                                    <div className="text-2xl font-bold text-white">850</div>
                                    <div className="text-blue-400 text-xs mt-1">+8%</div>
                                </div>
                            </div>

                            {/* Mockup Chart Area */}
                            <div className="h-32 bg-gradient-to-t from-violet-500/20 to-transparent rounded-xl border border-white/5 relative overflow-hidden">
                                <svg className="absolute bottom-0 left-0 right-0 h-full w-full" preserveAspectRatio="none">
                                    <path d="M0,100 C150,50 300,80 450,20 L450,128 L0,128 Z" fill="url(#grad)" fillOpacity="0.4" />
                                    <defs>
                                        <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                        </motion.div>

                        {/* Floating Elements (Notificaciones simuladas) */}
                        <motion.div
                            animate={{ y: [0, 30, 0], rotate: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 7, delay: 1 }}
                            className="absolute -top-4 -right-4 bg-gray-800/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl z-30 w-48"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Zap className="w-4 h-4 text-green-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Nueva Venta</div>
                                    <div className="text-sm font-bold">+$249.00</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -25, 0], rotate: [0, -3, 0] }}
                            transition={{ repeat: Infinity, duration: 8, delay: 0.5 }}
                            className="absolute bottom-20 -left-8 bg-gray-800/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-xl z-30 w-40"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Globe className="w-4 h-4 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400">Visitas</div>
                                    <div className="text-sm font-bold">2.4k/hr</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 
        Features Section 
        Grid de características con efecto hover
      */}
            <section className="relative z-10 py-24 px-6 bg-black/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Todo lo que necesitas</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Herramientas potentes diseñadas para emprendedores modernos.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Smartphone className="w-6 h-6 text-fuchsia-400" />,
                                title: "Mobile First",
                                desc: "Tu tienda se ve increíble en cualquier dispositivo, optimizada para conversión móvil."
                            },
                            {
                                icon: <ShieldCheck className="w-6 h-6 text-violet-400" />,
                                title: "Seguridad Total",
                                desc: "Pagos encriptados y protección de datos de nivel bancario para tus clientes."
                            },
                            {
                                icon: <Zap className="w-6 h-6 text-indigo-400" />,
                                title: "Ultra Rápido",
                                desc: "Tecnología de punta que asegura tiempos de carga instantáneos."
                            }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-violet-500/30 transition-all group"
                            >
                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-violet-900/50 to-indigo-900/50 border border-white/10 rounded-3xl p-12 md:p-20 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">
                            ¿Listo para escalar tu negocio?
                        </h2>
                        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">
                            Únete a miles de emprendedores que ya confían en MercadoTech.
                        </p>

                        <Link
                            to="/register"
                            className="relative z-10 inline-block px-10 py-4 bg-white text-violet-900 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl"
                        >
                            Crear mi Tienda Gratis
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-white/5 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} MercadoTech. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
