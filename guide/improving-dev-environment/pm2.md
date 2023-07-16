# Gestión del proceso de tu bot con PM2

PM2 es un gestor de procesos. Gestiona los estados de tus aplicaciones para que puedas iniciar, detener, reiniciar y eliminar procesos. Ofrece funciones como la supervisión de los procesos en ejecución y la configuración de un "inicio con el sistema operativo" (ya sea Windows, Linux o Mac) para que los procesos se inicien al arrancar el sistema.

## Instalación

Puedes instalar PM2 utilizando el siguiente comando:

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install --global pm2
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn global add pm2
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add --global pm2
```
:::
::::

## Iniciando tu app

Después de instalar PM2, la forma más fácil de iniciar tu aplicación es ir al directorio en el que se encuentra tu bot y ejecutar lo siguiente:

```sh:no-line-numbers
pm2 start your-app-name.js
```

### Notas adicionales

El script `pm2 start` permite más argumentos opcionales en la línea de comandos.

- `--name`: Esto te permite establecer el nombre de tu proceso cuando lo listes con `pm2 list` o `pm2 monit`:

```sh:no-line-numbers
pm2 start app.js --name "Un nombre genial"
```

- `--watch`: Esta opción reiniciará automáticamente su proceso en cuanto se detecte un cambio en un archivo, lo que puede ser útil para entornos de desarrollo:

```bash
pm2 start app.js --watch
```

::: tip CONSEJO
El comando `pm2 start` puede tomar más parámetros opcionales, pero sólo estos dos son relevantes. Si quieres ver todos los parámetros disponibles, puedes consultar la documentación de pm2 [aquí](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/).
:::

Una vez que el proceso se inicia con pm2, puede ejecutar `pm2 monit` para supervisar todas las salidas de la consola de los procesos iniciados por pm2. Esto tiene en cuenta cualquier `console.log()` en tu código o errores de salida.

De forma similar a como se inicia el proceso, ejecutar `pm2 stop` detendrá el proceso actual sin eliminarlo de la interfaz de PM2:

```sh:no-line-numbers
pm2 stop app.js
```

## Configurar el arranque con tu sistema

Quizás una de las características más útiles de PM2 es ser capaz de arrancar con su Sistema Operativo. Esta característica asegurará que los procesos de tu bot siempre se inicien después de un reinicio (inesperado) (por ejemplo, después de un corte de energía).

Los pasos iniciales difieren según el sistema operativo. En esta guía, cubriremos los de Windows y Linux/MacOS.

### Primeros pasos para Windows

::: tip CONSEJO
Ejecútalos desde un símbolo del sistema administrativo para evitar ser golpeado con un montón de cuadros de diálogo UAC.
:::

**Instala el paquete [pm2-windows-service](https://www.npmjs.com/package/pm2-windows-service) desde npm:**

:::: code-group
::: code-group-item npm
```sh:no-line-numbers
npm install --global pm2-windows-service
```
:::
::: code-group-item yarn
```sh:no-line-numbers
yarn global add pm2-windows-service
```
:::
::: code-group-item pnpm
```sh:no-line-numbers
pnpm add --global pm2-windows-service
```
:::
::::

**Una vez finalizada la instalación, instala el servicio ejecutando el siguiente comando:**

```sh:no-line-numbers
pm2-service-install
```
::: tip CONSEJO
Puede utilizar el parámetro `-n` para definir el nombre del servicio: `pm2-service-install -n "nombre-del-servicio"`.
:::

### Primeros pasos para Linux/MacOS

Necesitarás un script de inicio, que puedes obtener ejecutando el siguiente comando:

```sh:no-line-numbers
# Detecta el sistema de inicio disponible, genera la configuración y activa el sistema de inicio.
pm2 startup
```

O, si desea especificar su máquina manualmente, seleccione una de las opciones con el comando:

```sh:no-line-numbers
pm2 startup [ubuntu | ubuntu14 | ubuntu12 | centos | centos6 | arch | oracle | amazon | macos | darwin | freesd | systemd | systemv | upstart | launchd | rcd | openrc]
```

La salida de ejecutar uno de los comandos listados arriba mostrará un comando para que usted lo ejecute con todas las variables de entorno y opciones configuradas.

**Ejemplo de salida para un usuario de Ubuntu:**

```sh:no-line-numbers
[PM2] You have to run this command as root. Execute the following command:
      sudo su -c "env PATH=$PATH:/home/user/.nvm/versions/node/v8.9/bin pm2 startup ubuntu -u user --hp /home/user
```

Después de ejecutar ese comando, puede continuar con el siguiente paso.

### Guardar la lista de procesos actual

Para guardar la lista de procesos actual de forma que se inicie automáticamente tras un reinicio, ejecute el siguiente comando:

```sh:no-line-numbers
pm2 save
```

Para desactivarlo, puede ejecutar el siguiente comando:

```sh:no-line-numbers
pm2 unstartup
```
