const readFile = async (fileSystem, productDirPath, productsFilePath) => {
  await fileSystem.promises.mkdir(productDirPath, {
    recursive: true
  })
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
