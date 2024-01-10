import * as vscode from "vscode";
import * as path from "path";

// Función para capitalizar la primera letra de una cadena
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "componentWizard.generarCodigo",
    () => {
      // Obtiene el nombre del archivo actual
      const fileName = vscode.window.activeTextEditor?.document.fileName;
      const componentName = path.basename(fileName || "", ".jsx");

      // Capitaliza la primera letra del nombre del componente
      const capitalizedComponentName = capitalizeFirstLetter(componentName);

      // Aquí es donde debes poner el código que quieres generar.
      const code = `export function ${capitalizedComponentName}() {
            return (
                <div>
                    <h1>Hola Mundo!</h1>
                </div>
            );
        };
        `;

      // Obtiene el editor activo
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No hay ningún editor activo");
        return;
      }

      // Inserta el código en la posición actual del cursor
      const position = editor.selection.active;
      editor.edit((editBuilder) => {
        editBuilder.insert(position, code);
      });

      // Formatea el documento
      const { document } = editor;
      vscode.commands
        .executeCommand("editor.action.formatDocument")
        .then(() => {
          document.save();
        });
    }
  );

  let createComponent = vscode.commands.registerCommand(
	"componentWizard.crearComponente",
	async (uri: vscode.Uri) => {
	  // Pide al usuario el nombre del nuevo componente
	  const componentName = await vscode.window.showInputBox({
		prompt: "Nombre del nuevo componente",
	  });
  
	  if (componentName) {
		// Obtiene la ruta de la carpeta seleccionada
		const directoryPath = uri.fsPath;
  
		// Crea la ruta del nuevo archivo
		const filePath = path.join(directoryPath, `${componentName}.jsx`);
  
		// Define el código de la plantilla del componente
		const code = `export function ${componentName}() {
		  return (
			  <div>
				  <h1>Hola Mundo!</h1>
			  </div>
		  );
		};
		`;
  
		// Crea el nuevo archivo con la plantilla del componente
		const fs = require("fs");
  
		fs.writeFile(filePath, code, (err: Error) => {
		  if (err) {
			vscode.window.showErrorMessage("No se pudo crear el componente");
		  } else {
			// Abre el nuevo archivo en el editor
			vscode.workspace.openTextDocument(filePath).then((document) => {
			  vscode.window.showTextDocument(document).then((editor) => {
				// Formatea el documento
				vscode.commands
				  .executeCommand("editor.action.formatDocument")
				  .then(() => {
					document.save();
					vscode.window.showInformationMessage(
					  "Componente creado exitosamente"
					);
				  });
			  });
			});
		  }
		});
	  }
	}
  );
  
  context.subscriptions.push(createComponent);
  

  context.subscriptions.push(disposable, createComponent);
}

export function deactivate() {}
