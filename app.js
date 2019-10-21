const { exec } = require("child_process");
const currentDir = process.cwd();
const fs = require("fs");

if (process.argv.length >= 3) {
	const fileName = process.argv[2];
	exec("git clone https://github.com/jehincastic/my-create-react-app.git", (error, stdout, stderr) => {
		if (error) {
			console.error(`exec error: ${error}`);
			return;
		} else {
			const path = currentDir + '/my-create-react-app';
			const newPath = `${currentDir}/${fileName}`;
			fs.rename(path, newPath, err => {
				if (err) {
    				console.error(err);
    				return;
				} else {
					console.log("Done")
				}
			})
		}
	});
} else {
	console.log("Provide a name");
}