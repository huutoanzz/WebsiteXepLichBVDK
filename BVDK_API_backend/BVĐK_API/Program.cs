using Microsoft.Extensions.DependencyInjection;
using MongoDB.Driver;
using BVĐK_API.Interfaces;
using BVĐK_API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Cấu hình kết nối MongoDB
var mongoClient = new MongoClient("mongodb://localhost:27017");
var mongoDatabase = mongoClient.GetDatabase("db_doAnXepLich");

// Đăng ký các dịch vụ
builder.Services.AddSingleton<IMongoClient>(mongoClient);  // Đăng ký MongoClient
builder.Services.AddSingleton<IMongoDatabase>(mongoDatabase);  // Đăng ký MongoDatabase
builder.Services.AddScoped<IDoctorRepository, DoctorRepository>();  
builder.Services.AddScoped<IClinicRepository, ClinicRepository>();
builder.Services.AddScoped<ISpecializationRepository, SpecializationRepository>();
builder.Services.AddScoped<IShiftRepository, ShiftRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<INgayNghiLeRepository, NgayNghiLeRepository>();
builder.Services.AddScoped<INgayNghiPhepRepository, NgayNghiPhepRepository>();
builder.Services.AddScoped<IScheduleRepository, ScheduleRepository>();
builder.Services.AddScoped<IBackupRestoreRepository, BackupRestoreRepository>();

// Thêm dịch vụ controller
builder.Services.AddControllers();

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Cấu hình Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Thêm middleware Swagger nếu trong môi trường phát triển
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Sử dụng CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

app.Run();
