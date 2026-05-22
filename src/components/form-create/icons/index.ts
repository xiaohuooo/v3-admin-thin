export default {
  install: () => {
    const modules = import.meta.glob("./svg/*.svg", { eager: true });
    console.log(modules, "--modules");
  }
};
