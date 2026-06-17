# PoketGochi 🦉

**Versión:** 2.1 | **Estado:** Prototipo con Feature de Evolución

Un Tamagotchi interactivo basado en un búho adorable, implementado como una aplicación web autocontenida en HTML/CSS/JavaScript. Inspirado en los clásicos juegos de cuidado de mascotas, con mecánicas modernas de progresión y personalización.

---

## 🎮 Características Principales

### Sistema de Cuidado
- **Tres estadísticas** visualizadas con barras de "pips" (pequeños cuadrados):
  - ♥ **Felicidad** (Happy): Se reduce cuando hay hambre o inactividad
  - ⌇ **Hambre** (Hunger): Aumenta con el tiempo; necesita alimentación frecuente
  - ☾ **Energía** (Energy): Se recupera al dormir, se gasta al jugar

### Acciones Disponibles (5 botones principales)
1. **Comer** 🍎 — Aumenta hambre, añade pequeña felicidad
2. **Jugar** 🎮 — Requiere energía mínima; gasta energía, suma felicidad
3. **Dormir** 😴 — Activa/desactiva modo sueño; recupera energía
4. **Limpiar** 🛁 — Cura enfermedad si la hay
5. **Tienda** 🛍️ — Acceso al sistema de compras

### Sistema de Monedas (🪙)
- Se generan automáticamente cada 20 segundos (~1 moneda)
- Velocidad aumenta 30% si posees la **guitarra eléctrica**
- Se guardan en localStorage

### Tienda & Inventario
**Items disponibles:**
- **Auriculares** (30💰) — Reduce decaimiento de felicidad 20%
- **Tocadiscos** (60💰) — Reduce decaimiento de felicidad 30%
- **Lentes de lectura** (90💰) — Reduce decaimiento de energía 30%
- **Caramelo** (10💰) — Uso único; +2 a todos los estadísticas
- **Guitarra eléctrica** (300💰) — Genera monedas 30% más rápido

Todos los items (excepto caramelo) se compran una sola vez y su efecto es permanente.

---

## 🦉 El Búho (Mascota)

### Forma Base
- **Nombre:** PIO (personalizable en tweaks)
- Búho marrón claro con grandes ojos azules
- Comportamientos animados:
  - Parpadea continuamente
  - Movimiento suave de respiración
  - Aleteos de alas al reposo
  - Chirridos ocasionales en el pico
  - Saltos sutiles cada 2.6 segundos

### Estados
1. **Normal** — Estado por defecto, interactivo
2. **Dormido** (😴) — Ojos cerrados, líneas de roncido (Z), animaciones pausadas
3. **Emocionado** (😊) — Aleteos rápidos, saltos energéticos (duraci algunos segundos)
4. **Enfermo** (🤒) — Efecto de desaturación visual, signo @ rotativo

### Animaciones de Boca
- Parpadea: cada ~5 segundos
- Abre y cierra el pico rítmicamente en modo reposo
- Expresa emociones con texto en burbujas

### Forma Evolucionada
- **Desbloqueable** vía botón "Evolucionar" (solo para testing)
- Búho más oscuro y fornido
- Ojos más pequeños (expresión furiosa)
- Cejas gruesas fruncidas
- Cola más larga con 7 plumas extendidas
- Talones más largos y afilados
- Crestas de plumas en las orejas (horned owl)
- Animación espectacular de evolución con flash de luz

---

## 🎨 Diseño Visual

### Interfaz
- **Estilo:** Inspirado en Game Boy/Tamagotchi retro
- **Dispositivo:** Marco oscuro con pantalla verde clásica (ajustable a modo nocturno)
- **Resolución:** 380×460px (escala responsiva en móvil)
- **Fuentes:** Fredoka (UI) + VT323 (HUD monoespaciada)

### Elementos Visuales
- **LED indicador** verde brillante en la esquina superior
- **Reloj digital** (HH:MM) en tiempo real
- **Contador de monedas** con emoji de moneda
- **Burbujas de diálogo** estilo cómic para el búho
- **Efectos de partículas:**
  - ❤️ Corazones flotantes al jugar
  - 🍞 Migas de pan al comer
  - Z's al dormir
  - @ swirl al estar enfermo
  - Números para efectos especiales (+3, +1, etc.)

### Modo Nocturno
- Activa vía tweaks
- Pantalla azul-oscura en lugar de verde
- Búho y UI adaptan colores para legibilidad

---

## 💾 Persistencia

Todos los datos se guardan en **localStorage** del navegador:
- `poketgochi_coins` — Monedas actuales
- `poketgochi_inv` — Inventario (objeto JSON con items booleanos)
- `poketgochi_evolved` — Estado de evolución ('1' o undefined)

Los datos persisten entre sesiones. Borrar localStorage = reiniciar el juego.

---

## 🛠️ Panel de Ajustes (Tweaks)

Panel flotante en la esquina inferior izquierda permite:
- **Nombre del búho** — Texto personalizable (se convierte a mayúsculas)
- **Velocidad de animación** — 0.3x a 3x (slider)
- **Modo noche** — Toggle para tema oscuro
- **Saltos automáticos** — Toggle para activar/desactivar animación de saltos

Los tweaks se aplican en tiempo real y se sincronizan con el panel de edición embedido (si se invoca vía postMessage desde un editor externo).

---

## 🔄 Ciclo de Juego

### Cada 4 segundos:
- Si está despierto: hambre decrece (-0.3), energía decrece (-0.15, reducido a -0.105 con lentes)
- Si está dormido: energía aumenta (+0.4), hambre decrece suavemente (-0.1)
- Si hambre < 3 o felicidad < 3: felicidad decrece (afectada por auriculares/tocadiscos)
- Si hambre ≤ 0: 10% de probabilidad de enfermarse

### Cada 5.5 segundos (cuando está despierto):
- 18% de probabilidad de que el búho hable frases cortas: "¡hu hu!", "¡pío!", "♪", "..."

### Cada 50 segundos:
- Frases largas más complejas o emotivas (mensajes sobre estado de ánimo, bromas de búhos, etc.)

### Cada 20 segundos:
- +1 moneda (velocidad variable según guitarra)

---

## 📱 Estructura del Código

**Archivo único:** `PoketGochi.html` (2148 líneas)

### Secciones principales:
1. **HTML** — Estructura del dispositivo, SVG del búho, UI de botones y modal
2. **CSS** — Estilos, animaciones (keyframes), variables de tema, responsividad
3. **JavaScript**
   - `STATE` — Objeto con estadísticas del búho
   - `INVENTORY` — Items comprados
   - Funciones de acción: `feed()`, `play()`, `sleep()`, `clean()`
   - Lógica de decay y checkeos (setInterval)
   - Sistema de compra: `buyItem()`
   - Panel de tweaks: `buildPanel()`
   - Evolución: `runEvolution()`, `resetEvolution()`

### SVG Owl (base)
- ViewBox 300×360
- Gradientes radiales para volumen (body, belly, iris, etc.)
- Patrones para texturas de plumas
- Grupos (`<g>`) para partes animadas (alas, párpados, pico, cola)
- 778 líneas de SVG

### SVG Owl (evolved)
- Similar al base pero más oscuro y detallado
- Cejas fruncidas, talones más largos, crestas
- Ojos con expresión más feroz (iris dorado/naranja)
- 400+ líneas de SVG

---

## 🎯 Mecánicas de Progresión

### Objetivos típicos:
1. Mantener al búho feliz, alimentado y descansado
2. Acumular monedas para comprar items
3. Desbloquear items para mejorar velocidad de generación de monedas
4. Experimentar con la evolución (feature de testing)
5. Observar comportamientos y animaciones únicas según el estado

### Dificultad:
- **Fácil al inicio** — Estados decrecen lentamente si se atiende regularmente
- **Moderada a largo plazo** — Necesita atención cada 1-2 minutos para mantener óptimo
- **Items ofrecen shortcuts** — Pagar monedas reduce presión de cuidado

---

## 🚀 Cómo Usar

### Web
1. Abre `PoketGochi.html` en cualquier navegador moderno
2. Interactúa con los 5 botones principales
3. Abre la Tienda para comprar items
4. Usa el Panel de Tweaks (esquina inferior izq) para personalizar

### Características Especiales
- **Cierre:** Botón × en esquina superior derecha (cierra la ventana si es iframe/popup)
- **Evolución:** Botones "Evolucionar" y "Reset" permiten testing visual de la forma evolucionada
- **Debug:** Abre DevTools → Console para inspeccionar `STATE`, `INVENTORY`, `TWEAKS`

---

## 📋 Notas Técnicas

### Compatibilidad
- **Navegadores:** Chrome, Firefox, Safari, Edge (versiones modernas)
- **Dispositivos:** Desktop, tablet, móvil (responsive)
- **APIs usadas:** localStorage, requestAnimationFrame (vía CSS animations), postMessage

### Rendimiento
- Animaciones CSS puras (no JavaScript) → fluidez en ~60 FPS
- Lógica en setInterval cada 4-50 segundos → bajo consumo CPU
- localStorage sincrónico pero rápido para cantidades pequeñas de datos

### Problemas Conocidos / Limitaciones
- localStorage es local al dominio/página — no sincroniza entre pestañas
- Evolution es solo visual (botón de testing) — no hay requisitos de estadísticas para desbloquear
- Panel de tweaks requiere postMessage para sincronizar con editor externo (función de "modo edición")

---

## 🎓 Inspiración & Context

**PoketGochi** es un proyecto educativo/divertido que combina:
- Nostalgia de Tamagotchi (1996)
- Estética de Game Boy (pantalla verde, píxeles)
- Mecánicas modernas de idle games (generación automática de recursos)
- Arte SVG detallado y animaciones CSS
- Almacenamiento local para persistencia

Perfecto para aprender sobre:
- HTML/CSS/JavaScript vanilla
- SVG y animaciones
- Máquinas de estado (game loop)
- localStorage y persistencia de datos
- Diseño responsivo y accesibilidad

---

## 📄 Archivos

- `PoketGochi.html` — Aplicación completa (self-contained)
- `README.md` — Este archivo

---

## 🎨 Créditos de Diseño

- **Arte del búho:** SVG custom con gradientes detallados
- **Animaciones:** CSS keyframes + JavaScript timers
- **UI/UX:** Inspirado en dispositivos Tamagotchi retro
- **Sonidos:** (No incluidos en versión 2.1)
- **Tipografía:** Fredoka (UI), VT323 (HUD retro)

---

**Enjoy tu Tamagotchi búho interactivo! 🦉✨**
