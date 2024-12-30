-- DropForeignKey
ALTER TABLE `contatos_grupos` DROP FOREIGN KEY `contatos_grupos_contato_id_fkey`;

-- DropForeignKey
ALTER TABLE `contatos_grupos` DROP FOREIGN KEY `contatos_grupos_grupo_id_fkey`;

-- AddForeignKey
ALTER TABLE `contatos_grupos` ADD CONSTRAINT `contatos_grupos_contato_id_fkey` FOREIGN KEY (`contato_id`) REFERENCES `contatos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contatos_grupos` ADD CONSTRAINT `contatos_grupos_grupo_id_fkey` FOREIGN KEY (`grupo_id`) REFERENCES `grupos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
