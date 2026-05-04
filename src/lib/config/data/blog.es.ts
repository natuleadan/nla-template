import type { BlogPost } from "@/lib/modules/blog";

export const blogPostsData: BlogPost[] = [
  {
    id: "001",
    slug: "guia-de-nutricion",
    title: "Guía Completa de Nutrición",
    excerpt:
      "Descubre los principios básicos de una alimentación equilibrada y cómo aplicarlos en tu día a día.",
    content: `<p>La nutrición es un pilar fundamental para mantener un estilo de vida saludable. Una alimentación adecuada no solo te proporciona la energía necesaria para tus actividades diarias, sino que también fortalece tu sistema inmunológico y previene enfermedades.</p>

<blockquote>"Que el alimento sea tu medicina y la medicina sea tu alimento." — Hipócrates</blockquote>

<h2>Proteínas: El bloque constructor</h2>
<p>Las proteínas son esenciales para la reparación y crecimiento de tejidos. Fuentes como pollo, pescado, huevos y legumbres deben estar presentes en tu dieta diaria. Se recomienda consumir entre <strong>1.6 y 2.2 gramos</strong> de proteína por kilogramo de peso corporal.</p>

<h3>Fuentes de proteína recomendadas</h3>
<ul>
  <li>Pollo y pavo — hasta 25g de proteína por 100g</li>
  <li>Pescados como salmón y atún — ricos en omega-3</li>
  <li>Huevos — la proteína de referencia biológica</li>
  <li>Legumbres como lentejas y garbanzos</li>
</ul>

<h2>Carbohidratos: Tu combustible</h2>
<p>Los carbohidratos complejos como avena, arroz integral y batata te proporcionan <strong>energía sostenida</strong> para tus actividades diarias.</p>

<h3>Distribución semanal sugerida</h3>
<table>
  <thead>
    <tr>
      <th>Día</th>
      <th>Desayuno</th>
      <th>Almuerzo</th>
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
  <li><strong>Desayuno (7:00):</strong> Avena con frutos rojos y nueces</li>
  <li><strong>Snack (10:00):</strong> Puñado de almendras y una manzana</li>
  <li><strong>Almuerzo (13:00):</strong> Pechuga de pollo con arroz integral y brócoli</li>
  <li><strong>Merienda (16:00):</strong> Yogur con granola</li>
  <li><strong>Cena (21:00):</strong> Salmón con batata y espárragos</li>
</ol>

<h2>Hidratación: el factor olvidado</h2>
<p>Una correcta hidratación puede mejorar tu rendimiento hasta en un <strong>20%</strong>. Bebe al menos <code>2-3 litros</code> de agua al día.</p>

<p>Para cálculos personalizados:</p>
<pre><code>Agua diaria (L) = Peso (kg) × 0.033
Ejemplo: 70kg × 0.033 = 2.31L/día</code></pre>

<hr />

<p><em>Recuerda que cada cuerpo es diferente. Consulta con un profesional de la salud para obtener recomendaciones personalizadas.</em></p>`,
    image: "https://placehold.co/600x400?text=Nutricion",
    author: "María García",
    category: "nutricion",
    tags: ["nutrición", "alimentación", "salud"],
    publishedAt: "2025-12-15",
    readingTime: 5,
    attachments: [
      { name: "Catálogo de productos.pdf", url: "/medias/news/guia-de-nutricion/catalogo-productos.pdf", size: "2.4 MB" },
      { name: "Guía de referencia.xlsx", url: "/medias/news/guia-de-nutricion/guia-referencia.xlsx", size: "1.1 MB" },
      { name: "Plantilla informe.docx", url: "/medias/news/guia-de-nutricion/plantilla.docx", size: "856 KB" },
    ],
  },
  {
    id: "002",
    slug: "organizacion-diaria",
    title: "Cómo Organizar tu Rutina Diaria",
    excerpt:
      "Una guía práctica para estructurar tu día y maximizar tu productividad con hábitos saludables.",
    content:
      "<p>Una rutina diaria bien organizada es la clave para lograr resultados consistentes en cualquier ámbito de tu vida. Ya sea que busques mejorar tu productividad, tu salud o tu bienestar general, la organización de tu día marca la diferencia.</p><h2>La importancia de la rutina</h2><p>Tener una rutina estructurada reduce la fatiga de decisiones y libera energía mental para lo que realmente importa. Cuando automatizas las decisiones pequeñas, tu cerebro tiene más recursos para las tareas importantes.</p><h2>Mañana productiva</h2><p>Los primeros 30 minutos de tu día marcan el tono para el resto. Levántate a la misma hora, hidrátate, y dedica tiempo a planificar tu día antes de revisar el teléfono.</p><h2>Bloques de trabajo</h2><p>Organiza tu tiempo en bloques de 90 minutos con descansos de 10-15 minutos entre cada uno. Esta técnica, conocida como gestión por intervalos, aprovecha los ritmos naturales de concentración de tu cerebro.</p><h2>Noche reparadora</h2><p>Una rutina nocturna consistente (sin pantallas 1 hora antes de dormir, lectura ligera, temperatura fresca) mejora significativamente la calidad del sueño y la recuperación para el día siguiente.</p>",
    image: "https://placehold.co/600x400?text=Entrenamiento",
    author: "Carlos López",
    category: "productividad",
    tags: ["rutina", "organización", "hábitos"],
    publishedAt: "2025-11-20",
    readingTime: 7,
  },
  {
    id: "003",
    slug: "beneficios-del-descanso",
    title: "Beneficios del Descanso Activo",
    excerpt:
      "El descanso es fundamental para la salud y el bienestar. Aprende por qué es importante y cómo optimizar tu recuperación.",
    content:
      "<p>El descanso es probablemente el componente más subestimado de una vida saludable. Muchos creen que más actividad siempre es mejor, pero la realidad es que el cuerpo y la mente se regeneran durante el reposo.</p><h2>¿Por qué es importante descansar?</h2><p>Durante la actividad diaria, generamos desgaste físico y mental. Es durante el descanso que el cuerpo repara tejidos, consolida memoria y recarga energía. Sin descanso adecuado, el rendimiento disminuye.</p><h2>Sueño de calidad</h2><p>Dormir entre 7 y 9 horas es crucial para la salud. Durante el sueño profundo, el cuerpo libera hormonas esenciales para la reparación celular y el sistema inmunológico.</p><h2>Días de descanso activo</h2><p>Un día de descanso activo puede incluir caminatas, estiramientos suaves o lectura. Estas actividades promueven la circulación y ayudan a despejar la mente sin añadir estrés adicional.</p>",
    image: "https://placehold.co/600x400?text=Descanso",
    author: "Ana Martínez",
    category: "salud",
    tags: ["descanso", "recuperación", "bienestar"],
    publishedAt: "2025-10-10",
    readingTime: 4,
  },
  {
    id: "004",
    slug: "beneficios-de-la-proteina",
    title: "Beneficios de la Proteína en tu Dieta",
    excerpt:
      "Descubre por qué la proteína es esencial para tu salud y cómo incorporarla fácilmente en tus comidas diarias.",
    content:
      "<p>La proteína es uno de los macronutrientes más importantes para el funcionamiento del cuerpo humano. Desde la reparación de tejidos hasta la producción de enzimas y hormonas, sus funciones son múltiples y esenciales.</p><h2>¿Por qué necesitamos proteína?</h2><p>Las proteínas están formadas por aminoácidos, que son los bloques constructores del cuerpo. El cuerpo humano utiliza proteínas para construir y reparar tejidos, producir enzimas y hormonas, y mantener la salud de huesos, músculos y piel.</p><h2>Fuentes de proteína</h2><p>Existen fuentes animales (carnes magras, pescado, huevos, lácteos) y vegetales (legumbres, tofu, quinoa, frutos secos). Una dieta variada que incluya ambas fuentes asegura un perfil completo de aminoácidos.</p><h2>¿Cuánta proteína necesito?</h2><p>La cantidad recomendada varía según la edad, el nivel de actividad y los objetivos de cada persona. Como referencia general, se sugiere un consumo de 0.8 a 1.2 gramos por kilogramo de peso corporal al día.</p><h2>Consejos prácticos</h2><p>Incluir proteína en cada comida principal ayuda a mantener la saciedad y estabilizar los niveles de azúcar en sangre. Un puñado de nueces, un huevo duro o un vaso de leche son opciones simples y efectivas.</p>",
    image: "https://placehold.co/600x400?text=Proteina",
    author: "Laura Mendoza",
    category: "nutricion",
    tags: ["proteína", "nutrición", "salud"],
    publishedAt: "2025-09-05",
    readingTime: 4,
  },
];
