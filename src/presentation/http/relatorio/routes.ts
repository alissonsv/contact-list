import { ReportGroupUsecase } from "#/data/usecases/contato-grupo/report-group-usecase";
import { PrismaContactGroupRepository } from "#/infra/repositories/prisma-contact-group-repository";
import express from "express";

const router = express.Router();

router.get("/contatos-grupos", async (req, res) => {
  const contactGroupRepository = new PrismaContactGroupRepository();
  const reportGroupUsecase = new ReportGroupUsecase(contactGroupRepository);

  try {
    const report = await reportGroupUsecase.execute();

    return res.json(report);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
