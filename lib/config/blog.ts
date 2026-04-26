import type { BlogPost } from "@/lib/modules/blog";

export const blogPostsData: BlogPost[] = [
  {
    id: "1",
    slug: "nutricion-para-el-gym",
    title: "Nutrición para el Gym",
    excerpt: "Descubre los mejores alimentos para potenciar tu rendimiento en el gimnasio y acelerar tu recuperación muscular.",
    content: `<p>La nutrición es un pilar fundamental para cualquier persona que busque mejorar su rendimiento en el gimnasio. Una alimentación adecuada no solo te proporciona la energía necesaria para entrenar, sino que también acelera la recuperación y previene lesiones.</p>

<blockquote>"Que el alimento sea tu medicina y la medicina sea tu alimento." — Hipócrates</blockquote>

<h2>Proteínas: El bloque constructor</h2>
<p>Las proteínas son esenciales para la reparación y crecimiento muscular. Fuentes como pollo, pescado, huevos y legumbres deben estar presentes en tu dieta diaria. Se recomienda consumir entre <strong>1.6 y 2.2 gramos</strong> de proteína por kilogramo de peso corporal.</p>

<h3>Fuentes de proteína recomendadas</h3>
<ul>
  <li>Pollo y pavo — hasta 25g de proteína por 100g</li>
  <li>Pescados como salmón y atún — ricos en omega-3</li>
  <li>Huevos — la proteína de referencia biológica</li>
  <li>Legumbres como lentejas y garbanzos</li>
  <li>Suero de leche (whey) — absorción rápida post-entreno</li>
</ul>

<h2>Carbohidratos: Tu combustible</h2>
<p>Los carbohidratos complejos como avena, arroz integral y batata te proporcionan <strong>energía sostenida</strong> para tus entrenamientos. Consúmelos principalmente antes y después de entrenar.</p>

<h3>Distribución semanal sugerida</h3>
<table>
  <thead>
    <tr>
      <th>Día</th>
      <th>Pre-entreno</th>
      <th>Post-entreno</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Lunes</td>
      <td>Avena + plátano</td>
      <td>Arroz + pollo</td>
    </tr>
    <tr>
      <td>Miércoles</td>
      <td>Batata + huevos</td>
      <td>Pasta + salmón</td>
    </tr>
    <tr>
      <td>Viernes</td>
      <td>Tostadas + aguacate</td>
      <td>Quinoa + ternera</td>
    </tr>
  </tbody>
</table>

<h2>Grasas saludables</h2>
<p>No le temas a las grasas. El aguacate, frutos secos y aceite de oliva son fuentes de grasas saludables que apoyan la producción hormonal y la absorción de vitaminas.</p>

<h3>Ejemplo de menú diario</h3>
<ol>
  <li><strong>Desayuno (7:00):</strong> Avena con proteína en polvo y frutos rojos</li>
  <li><strong>Snack (10:00):</strong> Puñado de almendras y una manzana</li>
  <li><strong>Almuerzo (13:00):</strong> Pechuga de pollo con arroz integral y brócoli</li>
  <li><strong>Pre-entreno (16:00):</strong> Plátano con mantequilla de maní</li>
  <li><strong>Post-entreno (18:30):</strong> Batido de whey con leche y avena</li>
  <li><strong>Cena (21:00):</strong> Salmón con batata y espárragos</li>
</ol>

<h2>Hidratación: el factor olvidado</h2>
<p>Una correcta hidratación puede mejorar tu rendimiento hasta en un <strong>20%</strong>. Bebe al menos <code>2-3 litros</code> de agua al día, y más si entrenas intensamente.</p>

<p>Para cálculos personalizados, puedes usar la fórmula:</p>
<pre><code>Agua diaria (L) = Peso (kg) × 0.033
Ejemplo: 70kg × 0.033 = 2.31L/día</code></pre>

<h2>Suplementación recomendada</h2>
<p>Si bien la base debe ser siempre la comida real, algunos suplementos pueden ayudarte a cubrir carencias:</p>
<ul>
  <li><strong>Whey Protein:</strong> Ideal para alcanzar tus requerimientos proteicos diarios</li>
  <li><strong>Creatina:</strong> El suplemento con más respaldo científico para fuerza y potencia</li>
  <li><strong>Omega-3:</strong> Antiinflamatorio natural que apoya la recuperación articular</li>
</ul>

<hr />

<p><em>Recuerda que cada cuerpo es diferente. Te recomendamos consultar con un nutricionista deportivo para obtener un plan personalizado ajustado a tus necesidades y objetivos específicos.</em></p>`,
    image: "/images/blog/nutricion.jpg",
    author: "María García",
    category: "nutricion",
    tags: ["nutrición", "proteínas", "recuperación"],
    publishedAt: "2025-12-15",
    readingTime: 5,
  },
  {
    id: "2",
    slug: "rutina-de-entrenamiento",
    title: "Rutina de Entrenamiento Efectiva",
    excerpt: "Una guía completa para estructurar tu rutina de entrenamiento semanal y maximizar resultados en el gimnasio.",
    content: "<p>Una rutina de entrenamiento bien estructurada es la clave para lograr resultados consistentes. Ya sea que busques ganar masa muscular, perder grasa o mejorar tu condición física general, la organización de tu semana de entrenamiento marca la diferencia.</p><h2>Frecuencia ideal</h2><p>Para la mayoría de las personas, entrenar de 3 a 5 veces por semana es óptimo. Esto permite estimular cada grupo muscular con la frecuencia necesaria sin caer en el sobreentrenamiento.</p><h2>División de grupos musculares</h2><p>Una división popular es el entrenamiento torso-pierna, que alterna días de empuje, tracción y piernas. Otra opción efectiva es el entrenamiento de cuerpo completo 3 veces por semana.</p><h2>Progresión y sobrecarga</h2><p>Para seguir viendo resultados, debes aplicar el principio de sobrecarga progresiva: aumentar gradualmente el peso, las repeticiones o el volumen de entrenamiento.</p>",
    image: "/images/blog/entrenamiento.jpg",
    author: "Carlos López",
    category: "entrenamiento",
    tags: ["rutina", "ejercicios", "fuerza"],
    publishedAt: "2025-11-20",
    readingTime: 7,
  },
  {
    id: "3",
    slug: "beneficios-del-descanso",
    title: "Beneficios del Descanso Activo",
    excerpt: "El descanso es tan importante como el entrenamiento. Aprende por qué es fundamental y cómo optimizar tu recuperación.",
    content: "<p>El descanso es probablemente el componente más subestimado del entrenamiento. Muchos creen que más entrenamiento siempre es mejor, pero la realidad es que el crecimiento muscular ocurre fuera del gimnasio, durante el reposo.</p><h2>¿Por qué es importante descansar?</h2><p>Durante el entrenamiento, generamos microdesgarros en las fibras musculares. Es durante el descanso que el cuerpo repara estos tejidos, haciéndolos más fuertes y resistentes. Sin descanso adecuado, este proceso se interrumpe.</p><h2>Sueño de calidad</h2><p>Dormir entre 7 y 9 horas es crucial. Durante el sueño profundo, el cuerpo libera hormona de crecimiento, esencial para la reparación muscular. Además, el sueño regula el cortisol, la hormona del estrés que puede afectar negativamente tu progreso.</p><h2>Días de descanso activo</h2><p>Un día de descanso activo puede incluir caminatas, estiramientos suaves o yoga. Estas actividades promueven la circulación sanguínea y ayudan a eliminar toxinas de los músculos sin añadir estrés adicional.</p>",
    image: "/images/blog/descanso.jpg",
    author: "Ana Martínez",
    category: "salud",
    tags: ["descanso", "recuperación", "sueño"],
    publishedAt: "2025-10-10",
    readingTime: 4,
  },
];
