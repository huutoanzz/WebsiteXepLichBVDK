using BVĐK_API.Interfaces;
using MongoDB.Driver;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BVĐK_API.Repositories
{
    public class BackupRestoreRepository : IBackupRestoreRepository
    {
        private readonly IMongoDatabase _database;

        public BackupRestoreRepository(IMongoDatabase database)
        {
            _database = database;
        }

        public async Task BackupDataAsync(string outputPath)
        {
            var databaseName = _database.DatabaseNamespace.DatabaseName;

            if (!Directory.Exists(outputPath))
            {
                Directory.CreateDirectory(outputPath);
            }

            // Đường dẫn đầy đủ đến mongodump.exe
            var mongodumpPath = @"C:\Program Files\MongoDB\DatabaseTools\mongodb-database-tools-windows-x86_64-100.10.0\bin\mongodump.exe";

            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = mongodumpPath,
                    Arguments = $"--uri=\"mongodb://localhost:27017\" --db {databaseName} --out \"{outputPath}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };

            process.Start();
            await process.WaitForExitAsync();

            if (process.ExitCode != 0)
            {
                var errorOutput = await process.StandardError.ReadToEndAsync();
                throw new IOException($"Backup failed: {errorOutput}");
            }
        }



        public async Task RestoreDataAsync(IFormFile file)
        {
            var tempFilePath = Path.Combine(Path.GetTempPath(), "backup_restore_temp");

            if (!Directory.Exists(tempFilePath))
            {
                Directory.CreateDirectory(tempFilePath);
            }

            var zipFilePath = Path.Combine(tempFilePath, file.FileName);

            await using (var stream = new FileStream(zipFilePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Kiểm tra tệp ZIP
            if (!File.Exists(zipFilePath))
            {
                throw new FileNotFoundException("Backup file not found", zipFilePath);
            }

            var extractPath = Path.Combine(tempFilePath, "extracted");

            // Giải nén tệp
            try
            {
                System.IO.Compression.ZipFile.ExtractToDirectory(zipFilePath, extractPath, overwriteFiles: true);
            }
            catch (Exception ex)
            {
                throw new IOException($"Error extracting the backup file: {ex.Message}");
            }

            var databaseName = _database.DatabaseNamespace.DatabaseName;


            var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = "mongorestore",
                    Arguments = $"--uri=\"mongodb://localhost:27017\" --db {databaseName} \"{extractPath}\"",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };


            process.Start();
            await process.WaitForExitAsync();

            if (process.ExitCode != 0)
            {
                var errorOutput = await process.StandardError.ReadToEndAsync();
                var output = await process.StandardOutput.ReadToEndAsync();
                throw new IOException($"Restore failed: {errorOutput}\nOutput: {output}");
            }

            // Dọn dẹp thư mục tạm thời
            Directory.Delete(tempFilePath, recursive: true);
        }

    }
}
