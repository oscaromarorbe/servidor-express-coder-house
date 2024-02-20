const readFile = async (fileSystem, productsFilePath) => {
  if (!fileSystem.existsSync(productsFilePath)) {
    await fileSystem.promises.writeFile(productsFilePath, '[]')
  }
  let productsFile = await fileSystem.promises.readFile(
    productsFilePath,
    'utf-8'
  )
	return JSON.parse(productsFile);
}

module.exports = {readFile}
