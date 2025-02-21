"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const xlsx_1 = __importDefault(require("xlsx"));
const fs_1 = __importDefault(require("fs"));
const db_utils_1 = __importDefault(require("../utils/db.utils"));
const processFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = xlsx_1.default.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    try {
        db_utils_1.default.serialize(() => {
            // Prepare statements for each table
            const employeeStmt = db_utils_1.default.prepare(`INSERT OR IGNORE INTO Employees (TE_ID, first_name, last_name, email, phone_number, date_of_joining, manager_id) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`);
            const programStmt = db_utils_1.default.prepare(`INSERT OR IGNORE INTO Programs (program_id, program_name, program_description, start_date, end_date) 
                 VALUES (?, ?, ?, ?, ?)`);
            const employeeProgramStmt = db_utils_1.default.prepare(`INSERT OR IGNORE INTO Employee_Programs (TE_ID, program_id, expertise_area, sme_status) 
                 VALUES (?, ?, ?, ?)`);
            // Loop through each sheet and map data accordingly
            sheetNames.forEach((sheetName) => {
                const data = xlsx_1.default.utils.sheet_to_json(workbook.Sheets[sheetName]);
                if (sheetName === 'Employees') {
                    data.forEach(row => {
                        if (row.TE_ID && row.first_name && row.email && row.date_of_joining) {
                            employeeStmt.run(row.TE_ID, row.first_name, row.last_name || null, row.email, row.phone_number || null, row.date_of_joining, row.manager_id || null);
                        }
                    });
                }
                else if (sheetName === 'Programs') {
                    data.forEach(row => {
                        if (row.program_id && row.program_name) {
                            programStmt.run(row.program_id, row.program_name, row.program_description || null, row.start_date || null, row.end_date || null);
                        }
                    });
                }
                else if (sheetName === 'Employee_Programs') {
                    data.forEach(row => {
                        if (row.TE_ID && row.program_id) {
                            employeeProgramStmt.run(row.TE_ID, row.program_id, row.expertise_area || null, row.sme_status || 'NO');
                        }
                    });
                }
            });
            // Finalize prepared statements
            employeeStmt.finalize();
            programStmt.finalize();
            employeeProgramStmt.finalize();
        });
        fs_1.default.unlinkSync(filePath); // Delete the file after processing
        return '✅ All data imported successfully!';
    }
    catch (err) {
        console.error('❌ Error importing data:', err);
        throw err;
    }
});
exports.default = { processFile };
