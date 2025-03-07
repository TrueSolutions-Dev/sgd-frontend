# Instrucciones para Subir Cambios a la Rama `develop`

Este documento explica el flujo de trabajo que se debe seguir para subir cambios al repositorio en la rama `develop`. 
**No hay protección de la rama `main`**, pero **todas las nuevas funcionalidades y correcciones deben ser subidas a `develop` primero** para tener un respaldo.

## Flujo de Trabajo
```bash
### 1. Clona el Repositorio
Si aún no has clonado el repositorio, usa el siguiente comando:

git clone https://github.com/TrueSolutions-Dev/sgd-frontend.git

Siempre que vayas a trabajar en una nueva característica o corregir un error, crea una rama nueva basada en la rama develop:

### 2. Cambia a la rama develop
git checkout develop

### 3. Actualiza la rama local con la última versión de develop desde el repositorio remoto
git pull origin develop

### 4. Crear una nueva rama 
### El nombre de tu rama debe ser descriptivo, es decir si estas trabajando con un cambio, hacer:
git checkout -b feature/DASH1-Login-changes

### También, revisar la última rama para llevar un número consecutivo, por ejemplo:
Si la última rama fue feature/DASH1-Login-changes,
hacer la siguiente con feature/DASH2-Login-styles.

### 5. Hacer los cambios necesarios en tu rama. 
### Después de hacer los cambios, agrega los archivos modificados al área de preparación y haz un commit con un mensaje.
git add .
git commit -m "Descripción del cambio"

### 6. Enviar los cambios a la branch remota 
git push origin feature/DASH1-Login-changes

### 7. Crear Pull Request
Una vez que hayas subido tus cambios, crear un Pull Request desde la rama hacia develop.
````



