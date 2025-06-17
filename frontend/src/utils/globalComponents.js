/**
 * Utility for automatically registering global components
 * This allows us to register components without manually importing each one - it uses Vite's import.meta.glob feature for dynamic imports
 */

export function registerGlobalComponents(app) {
  const components = import.meta.glob('@/components/global/*.vue', { eager: true });
  
  // Register each component globally
  Object.entries(components).forEach(([path, component]) => {
    // Extract component name from path
    const componentName = path.split('/').pop().replace(/\.\w+$/, '');
    
    // Register the component
    app.component(componentName, component.default);
  });
}
