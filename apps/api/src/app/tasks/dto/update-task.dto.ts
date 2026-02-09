import { IsIn, IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn(['Todo', 'InProgress', 'Done'])
  status?: 'Todo' | 'InProgress' | 'Done';

  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;
}
