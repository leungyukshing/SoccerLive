// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { commands, window, workspace, ExtensionContext, StatusBarItem, StatusBarAlignment } from 'vscode';
import { fetchScores, updateTicker } from "./commands";
import Manager from "./models/Manager";
import { fetchGames } from "./api/soccer";
import Game from './models/Game';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "soccerlive" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	
	let disposable = commands.registerCommand('soccerlive.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		window.showInformationMessage('Soccer Live is active!');
	});
	
	context.subscriptions.push(disposable);

	context.subscriptions.push(commands.registerCommand("soccer-live.fetchScores", fetchScores));
	context.subscriptions.push(commands.registerCommand("soccer-live.updateTicker", updateTicker));

	const ticker = buildTicker();
	context.subscriptions.push(ticker);
	const manager = new Manager(ticker);
	
	fetchGames().then(games => {
		const result : Game[] = [];
		games.forEach((game) => {
			result.push(...game);
		})
		// console.log(result);
	});

	// poll data
	
	tickerPoll(manager);
	scoreboardPoll(manager);
}

function buildTicker(): StatusBarItem {
	const alignment = config("side") == "left" ? StatusBarAlignment.Left : StatusBarAlignment.Right;
	const priority = config("priority");
	return window.createStatusBarItem(alignment, priority);
}

function tickerPoll(manager: Manager): void {
	console.log("tickerPoll");
	console.log("config tickerDelaySeconds: " + config("tickerDelaySeconds"));
	commands.executeCommand("soccer-live.updateTicker", manager).then(
		undefined, (e) => console.error(e.message)
	);
	setTimeout(
		() => tickerPoll(manager), config("tickerDelaySeconds") * 1000
	);
}

function scoreboardPoll(manager: Manager): void {
	console.log("scoreboardPoll");
	console.log("config pollDelaySeconds: " + config("pollDelaySeconds"));
	commands.executeCommand("soccer-live.fetchScores", manager).then(
		undefined, (e) => console.error(e.message)
	);
	setTimeout(
		() => scoreboardPoll(manager), config("pollDelaySeconds") * 1000
	);
}

export function config(setting: string) {
	return workspace.getConfiguration("soccer-live")[setting];
}
// This method is called when your extension is deactivated
export function deactivate() {
	console.log("Soccer Live deactived.");
}
