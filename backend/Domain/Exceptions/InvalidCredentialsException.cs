namespace Domain.Exceptions;

public class InvalidCredentialsException : AppException
{
    public InvalidCredentialsException()
        : base(401, "Invalid email or password.")
    {
    }
}